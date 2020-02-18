import { FormGroup, HTMLSelect, NonIdealState, Tree } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import SterlingDrawer from '../../sterling/SterlingDrawer';
import ShapeSelector from './drawer-components/ShapeSelector';
import {
    collapseTreeNode,
    expandTreeNode,
    selectItem,
    setHeight,
    setRadius,
    setShape,
    setWidth,
    toggleCollapseLayout,
    toggleCollapseTheme
} from './graphSlice';

// Map redux state to graph settings props
const mapState = (state: RootState) => ({
    settings: state.graphSlice
});

// Actions
const mapDispatch = {
    collapseTreeNode,
    expandTreeNode,
    selectItem,
    setHeight,
    setRadius,
    setShape,
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
    const selectedItem = settings.selectedItem;
    const selectedStyle = settings.selectedItemStyle;

    return (
        <>
            <SterlingDrawer.Section
                collapsed={settings.collapseLayout}
                onToggle={props.toggleCollapseLayout}
                title={'Layout'}>
                HI.
            </SterlingDrawer.Section>
            <SterlingDrawer.Section
                collapsed={settings.collapseTheme}
                onToggle={props.toggleCollapseTheme}
                title={'Theme'}>
                <Tree
                    contents={[settings.sigTree || {id: 0, label: 'nope'}]}
                    onNodeClick={props.selectItem}
                    onNodeCollapse={props.collapseTreeNode}
                    onNodeExpand={props.expandTreeNode}
                />
                {
                    selectedItem
                        ? (
                            <>
                                <ShapeSelector
                                    style={selectedStyle}
                                    onSetHeight={props.setHeight}
                                    onSetRadius={props.setRadius}
                                    onSetShape={props.setShape}
                                    onSetWidth={props.setWidth}
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
