import {
    CircleLayout,
    DagreLayout,
    GridLayout,
    RowLayout
} from '@atdyer/graph-js';
import { Button, ButtonGroup, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import { toggleCollapseQuickLayout } from './layoutSlice';

// Map redux state to layout settings props
const mapState = (state: RootState) => ({
    collapseQuickLayout: state.graphSlice.layoutSlice.collapseQuickLayout,
    graph: state.graphSlice.graphSlice.graph,
    instance: state.sterlingSlice.instance
});

const mapDispatch = {
    toggleCollapseQuickLayout
};

// Create connector
const connector = connect(mapState, mapDispatch);

// Create props for things from redux
type LayoutProps = ConnectedProps<typeof connector>;

// The layout and projections component
const QuickLayout: React.FunctionComponent<LayoutProps> = props => {
    return (
        <SterlingDrawer.Section
            collapsed={props.collapseQuickLayout}
            onToggle={props.toggleCollapseQuickLayout}
            title={'Quick Layout'}>
            <ButtonGroup minimal={true}>
                <Tooltip content={'Circle Layout'}>
                    <Button icon={'layout-circle'} onClick={() => {
                        if (props.graph) {
                            const circle = new CircleLayout();
                            circle.apply(props.graph);
                            props.graph.update();
                        }
                    }}/>
                </Tooltip>
                <Tooltip content={'Grid Layout'}>
                    <Button icon={'layout-grid'} onClick={() => {
                        if (props.graph) {
                            const grid = new GridLayout();
                            grid.apply(props.graph);
                            props.graph.update();
                        }
                    }}/>
                </Tooltip>
                <Tooltip content={'Grouped Row Layout'}>
                    <Button icon={'layout-linear'} onClick={() => {
                        if (props.graph && props.instance) {
                            const row = new RowLayout();
                            const univ = props.instance.signatures().find(sig => sig.id() === 'univ');
                            if (univ) {
                                row.groups(univ.subTypes().map(sig => sig.atoms(true).map(atom => atom.name())))
                            }
                            row.apply(props.graph);
                            props.graph.update();
                        }
                    }}/>
                </Tooltip>
                <Tooltip content={'Layered Layout'}>
                    <Button icon={'layout-hierarchy'} onClick={() => {
                        if (props.graph) {
                            const dagre = new DagreLayout();
                            dagre.apply(props.graph);
                            props.graph.update();
                        }
                    }}/>
                </Tooltip>
            </ButtonGroup>
        </SterlingDrawer.Section>
    );
};

export default connector(QuickLayout);
