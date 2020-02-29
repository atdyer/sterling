import {
    Alignment,
    Button,
    ButtonGroup,
    Divider, FormGroup,
    NonIdealState, Switch,
    Tooltip,
    Tree
} from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import LabelStyler from '../../drawer-components/LabelStyler';
import { mapTreeToNodes } from '../../graphTypes';
import ShapeSelector from './components/ShapeSelector';
import ShapeStyler from './components/ShapeStyler';
import {
    clearAll,
    clearCurrent,
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setFill,
    setHeight,
    setLabelColor,
    setLabelSize,
    setRadius,
    setShape,
    setStroke,
    setStrokeWidth,
    setWidth,
    toggleCollapseNodeStyle,
    toggleHideDisconnected,
    toggleHideEmptySets
} from './nodeStylingSlice';

// Map redux state to node styling props
const mapState = (state: RootState) => ({
    ...state.graphSlice.nodeStylingSlice
});

// Actions
const mapDispatch = {
    clearAll,
    clearCurrent,
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setFill,
    setHeight,
    setLabelColor,
    setLabelSize,
    setRadius,
    setShape,
    setStroke,
    setStrokeWidth,
    setWidth,
    toggleCollapseNodeStyle,
    toggleHideDisconnected,
    toggleHideEmptySets
};

// Create connector
const connector = connect(mapState, mapDispatch);

// Create props for things from redux
type NodeStylingProps = ConnectedProps<typeof connector>;

const NodeStyling: React.FunctionComponent<NodeStylingProps> = props => {

    const selected = props.selected;

    // Hide disconnected
    const hideDisconnected = props.selected
        ? props.hideDisconnected.get(props.selected)
        : false;

    // Shape properties
    const shape = selected ? props.shapes.get(selected) || {} : {};
    const fill = shape ? shape.fill : undefined;
    const stroke = shape ? shape.stroke : undefined;
    const strokeWidth = shape ? shape.strokeWidth : undefined;

    // Label properties
    const label = selected ? props.labels.get(selected) || {} : {};
    const labelColor = label ? label.color : undefined;
    const font = label ? label.font : undefined;
    const match = font ? font.match(/(\d*)px/) : [];
    const labelSize = match
        ? match.length > 1
            ? parseInt(match[1])
            : undefined
        : undefined;

    // Tree properties
    const tree = mapTreeToNodes(props.nodeTree, props.collapsed, selected);
    const hide = props.hideEmptySets;
    tree.secondaryLabel = (
        <Tooltip
            content={hide ? 'Show Empty Sets' : 'Hide Empty Sets'}>
            <Button
                icon={hide ? 'eye-off' : 'eye-open'}
                minimal={true}
                onClick={props.toggleHideEmptySets}/>
        </Tooltip>
    );


    return (
        <SterlingDrawer.Section
            collapsed={props.collapseNodeStyle}
            onToggle={props.toggleCollapseNodeStyle}
            title={'Node Styling'}>
            <Tree
                contents={[tree]}
                onNodeClick={node => props.selectTreeNode(node.id.toString())}
                onNodeCollapse={node => props.collapseTreeNode(node.id.toString())}
                onNodeExpand={node => props.expandTreeNode(node.id.toString())}
            />
            <Divider/>
            {
                selected
                    ? (
                        <>
                            <FormGroup
                                contentClassName={'fill'}
                                inline={true}>
                                <Switch
                                    alignIndicator={Alignment.RIGHT}
                                    checked={hideDisconnected}
                                    onChange={props.toggleHideDisconnected}
                                    label={'Hide Disconnected Nodes'}/>
                            </FormGroup>
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
                                onChangeColor={props.setLabelColor}
                                onChangeSize={props.setLabelSize}/>
                            <ButtonGroup
                                fill={true}
                                minimal={true}>
                                <Button
                                    icon={'clean'}
                                    onClick={props.clearCurrent}
                                    text={'Clear Selected'}/>
                                <Button
                                    icon={'clean'}
                                    onClick={props.clearAll}
                                    text={'Clear All'}/>
                            </ButtonGroup>
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
