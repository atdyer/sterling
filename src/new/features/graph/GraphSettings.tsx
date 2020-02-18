import { CircleLayout } from '@atdyer/graph-js';
import { Button, ButtonGroup, NonIdealState, Tree } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import SterlingDrawer from '../../sterling/SterlingDrawer';
import ShapeAttributeSelector from './drawer-components/ShapeAttributeSelector';
import ShapeSelector from './drawer-components/ShapeSelector';
import {
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setFill,
    setHeight,
    setRadius,
    setShape,
    setStroke,
    setStrokeWidth,
    setWidth,
    toggleCollapseLayout,
    toggleCollapseTheme
} from './graphSlice';
import { mapTreeToNodes } from './graphTypes';

// Map redux state to graph settings props
const mapState = (state: RootState) => ({
    settings: state.graphSlice,
});

// Actions
const mapDispatch = {
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setFill,
    setHeight,
    setRadius,
    setShape,
    setStroke,
    setStrokeWidth,
    setWidth,
    toggleCollapseLayout,
    toggleCollapseTheme
};

// Create connector
const connector = connect(mapState, mapDispatch);

// Create props for things from redux
type GraphStageProps = ConnectedProps<typeof connector>;

// The graph settings component
const GraphSettings: React.FunctionComponent<GraphStageProps> = props => {

    const settings = props.settings;
    const selected = settings.selected;
    const shape = selected ? settings.shapes.get(selected) || {} : {};
    const tree = mapTreeToNodes(settings.signatureTree, settings.collapsed, selected);
    const fill = shape ? shape.fill : undefined;
    const stroke = shape ? shape.stroke : undefined;
    const strokeWidth = shape ? shape.strokeWidth : undefined;

    return (
        <>
            <SterlingDrawer.Section
                collapsed={settings.collapseLayout}
                onToggle={props.toggleCollapseLayout}
                title={'Layout'}>
                <ButtonGroup minimal={true}>
                    <Button icon={'layout-circle'} onClick={() => {
                        if (settings.graph) {
                            const circle = new CircleLayout();
                            circle.apply(settings.graph);
                            settings.graph.update();
                        }
                    }}/>
                </ButtonGroup>
            </SterlingDrawer.Section>
            <SterlingDrawer.Section
                collapsed={settings.collapseTheme}
                onToggle={props.toggleCollapseTheme}
                title={'Theme'}>
                <Tree
                    contents={[tree]}
                    onNodeClick={node => props.selectTreeNode(node.id.toString())}
                    onNodeCollapse={node => props.collapseTreeNode(node.id.toString())}
                    onNodeExpand={node => props.expandTreeNode(node.id.toString())}
                />
                {
                    selected
                        ? (
                            <>
                                <ShapeSelector
                                    shape={shape}
                                    onSetHeight={props.setHeight}
                                    onSetRadius={props.setRadius}
                                    onSetShape={props.setShape}
                                    onSetWidth={props.setWidth}
                                />
                                <ShapeAttributeSelector
                                    fill={fill}
                                    stroke={stroke}
                                    strokeWidth={strokeWidth}
                                    onChangeFill={props.setFill}
                                    onChangeStroke={props.setStroke}
                                    onChangeStrokeWidth={props.setStrokeWidth}
                                />
                            </>
                        )
                        : (
                            <NonIdealState
                            title={'Signature Theme'}
                            description={'Select a signature from the tree'}
                            icon={'style'}/>
                        )
                }

            </SterlingDrawer.Section>
        </>
    )
};

export default connector(GraphSettings);
