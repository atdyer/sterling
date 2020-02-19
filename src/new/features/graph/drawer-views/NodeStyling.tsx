import { NonIdealState, Tree } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../rootReducer';
import SterlingDrawer from '../../../sterling/SterlingDrawer';
import LabelStyler from '../drawer-components/LabelStyler';
import ShapeSelector from '../drawer-components/ShapeSelector';
import ShapeStyler from '../drawer-components/ShapeStyler';
import {
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setFill,
    setHeight,
    setNodeLabelColor,
    setNodeLabelSize,
    setRadius,
    setShape,
    setStroke,
    setStrokeWidth,
    setWidth
} from '../graphSlice';
import { mapTreeToNodes } from '../graphTypes';

// Map redux state to node styling props
const mapState = (state: RootState) => ({
    ...state.graphSlice
});

// Actions
const mapDispatch = {
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setFill,
    setHeight,
    setNodeLabelColor,
    setNodeLabelSize,
    setRadius,
    setShape,
    setStroke,
    setStrokeWidth,
    setWidth
};

// Create connector
const connector = connect(mapState, mapDispatch);

// Create props for things from redux
type NodeStylingProps = ConnectedProps<typeof connector>;

const NodeStyling: React.FunctionComponent<NodeStylingProps> = props => {

    const selected = props.selected;
    const shape = selected ? props.shapes.get(selected) || {} : {};
    const label = selected ? props.nodeLabels.get(selected) || {} : {};
    const tree = mapTreeToNodes(props.signatureTree, props.collapsed, selected);
    const fill = shape ? shape.fill : undefined;
    const stroke = shape ? shape.stroke : undefined;
    const strokeWidth = shape ? shape.strokeWidth : undefined;

    const labelColor = label ? label.color : undefined;
    const font = label ? label.font : undefined;
    const match = font ? font.match(/(\d*)px/) : [];
    const labelSize = match
        ? match.length > 1
            ? parseInt(match[1])
            : undefined
        : undefined;

    return (
        <SterlingDrawer.Section
            collapsed={false}
            onToggle={() => {}}
            title={'Node Styling'}>
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
                            <ShapeStyler
                                fill={fill}
                                stroke={stroke}
                                strokeWidth={strokeWidth}
                                onChangeFill={props.setFill}
                                onChangeStroke={props.setStroke}
                                onChangeStrokeWidth={props.setStrokeWidth}
                            />
                            <LabelStyler
                                color={labelColor}
                                size={labelSize}
                                onChangeColor={props.setNodeLabelColor}
                                onChangeSize={props.setNodeLabelSize}/>
                        </>
                    )
                    : (
                        <NonIdealState
                            title={'Node Styling'}
                            description={'Select a type or set from the tree'}
                            icon={'style'}/>
                    )
            }

        </SterlingDrawer.Section>
    );
};

export default connector(NodeStyling);
