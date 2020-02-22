import { Tree } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import { mapTreeToNodes } from '../../graphTypes';
import {
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    toggleCollapseEdgeStyle
} from './edgeStylingSlice';

const mapState = (state: RootState) => ({
    ...state.graphSlice.edgeStylingSlice
});

const mapDispatch = {
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    toggleCollapseEdgeStyle
};

const connector = connect(mapState, mapDispatch);

type EdgeStylingProps = ConnectedProps<typeof connector>;

const EdgeStyling: React.FunctionComponent<EdgeStylingProps> = props => {

    const selected = props.selected;
    const fieldTree = mapTreeToNodes(props.treeField, props.collapsed, selected);
    const skolemTree = mapTreeToNodes(props.treeSkolem, props.collapsed, selected);
    const isempty = fieldTree.id === 'error' && skolemTree.id === 'error';

    return (
        <>
            <SterlingDrawer.Section
                collapsed={props.collapseEdgeStyle}
                onToggle={props.toggleCollapseEdgeStyle}
                title={'Edge Styling'}>
                <Tree
                    contents={isempty ? [fieldTree] : [fieldTree, skolemTree]}
                    onNodeClick={node => props.selectTreeNode(node.id.toString())}
                    onNodeCollapse={node => props.collapseTreeNode(node.id.toString())}
                    onNodeExpand={node => props.expandTreeNode(node.id.toString())}/>
            </SterlingDrawer.Section>
        </>
    )
};

export default connector(EdgeStyling);
