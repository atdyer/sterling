import {
    Button, ButtonGroup,
    Divider,
    NonIdealState,
    Switch,
    Tree
} from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import LabelStyler from '../../drawer-components/LabelStyler';
import { mapTreeToNodes } from '../../graphTypes';
import LinkStyler from './components/LinkStyler';
import {
    clearAll,
    clearCurrent,
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setLabelColor,
    setLabelSize,
    setStroke,
    setStrokeWidth,
    toggleCollapseEdgeStyle,
    toggleHideEmptyRelations
} from './edgeStylingSlice';

const mapState = (state: RootState) => ({
    ...state.graphSlice.edgeStylingSlice
});

const mapDispatch = {
    clearAll,
    clearCurrent,
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setLabelColor,
    setLabelSize,
    setStroke,
    setStrokeWidth,
    toggleCollapseEdgeStyle,
    toggleHideEmptyRelations
};

const connector = connect(mapState, mapDispatch);

type EdgeStylingProps = ConnectedProps<typeof connector>;

const EdgeStyling: React.FunctionComponent<EdgeStylingProps> = props => {

    const selected = props.selected;
    const link = selected ? props.linkStyles.get(selected) || {} : {};
    const label = selected ? props.labelStyles.get(selected) || {} : {};

    const fieldTree = mapTreeToNodes(props.treeField, props.collapsed, selected);
    const skolemTree = mapTreeToNodes(props.treeSkolem, props.collapsed, selected);
    const isempty = fieldTree.id === 'error' && skolemTree.id === 'error';
    const hasskolem = skolemTree.childNodes && skolemTree.childNodes.length;
    const trees = (isempty || !hasskolem) ? [fieldTree] : [fieldTree, skolemTree];

    const stroke = link ? link.stroke : undefined;
    const strokeWidth = link ? link.strokeWidth : undefined;

    const labelColor = label ? label.color : undefined;
    const font = label ? label.font : undefined;
    const match = font ? font.match(/(\d*)px/) : [];
    const labelSize = match
        ? match.length > 1
            ? parseInt(match[1])
            : undefined
        : undefined;

    return (
        <>
            <SterlingDrawer.Section
                collapsed={props.collapseEdgeStyle}
                onToggle={props.toggleCollapseEdgeStyle}
                title={'Edge Styling'}>
                <Switch
                    checked={props.hideEmptyRelations}
                    label={'Hide Empty Relations'}
                    onChange={props.toggleHideEmptyRelations}/>
                <Tree
                    contents={trees}
                    onNodeClick={node => props.selectTreeNode(node.id.toString())}
                    onNodeCollapse={node => props.collapseTreeNode(node.id.toString())}
                    onNodeExpand={node => props.expandTreeNode(node.id.toString())}/>
                <Divider/>
                {
                    selected
                        ? (
                            <>
                                <LinkStyler
                                    stroke={stroke}
                                    strokeWidth={strokeWidth}
                                    onChangeStroke={props.setStroke}
                                    onChangeStrokeWidth={props.setStrokeWidth}/>
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
                                title={'Edge Styling'}
                                description={'Select a field or skolem from the tree'}
                                icon={'style'}/>

                        )
                }
            </SterlingDrawer.Section>
        </>
    )
};

export default connector(EdgeStyling);
