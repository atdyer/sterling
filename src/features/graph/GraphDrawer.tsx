import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import QuickEdgeStyling from './drawer-views/edge-styling/QuickEdgeStyling';
import EdgeSettings from './drawer-views/graph-settings/EdgeSettings';
import Layout from './drawer-views/layout/Layout';
import ZoomSettings from './drawer-views/layout/ZoomSettings';
import QuickNodeStyling from './drawer-views/node-styling/QuickNodeStyling';
import Projections from './drawer-views/projections/Projections';
import EdgeStyling from './drawer-views/edge-styling/EdgeStyling';
import GraphSettings from './drawer-views/graph-settings/GraphSettings';
import QuickLayout from './drawer-views/layout/QuickLayout';
import NodeStyling from './drawer-views/node-styling/NodeStyling';

// Map redux state to graph settings props
const mapState = (state: RootState) => ({
    view: state.sterlingSlice.graphView
});

// Create connector
const connector = connect(mapState);

// Create props for things from redux
type GraphDrawerProps = ConnectedProps<typeof connector>;

// The graph settings component
const GraphDrawer: React.FunctionComponent<GraphDrawerProps> = props => {

    if (props.view === 'node') return (
        <>
            <Projections/>
            <QuickNodeStyling/>
            <NodeStyling/>
        </>
    );
    if (props.view === 'edge') return (
        <>
            <QuickEdgeStyling/>
            <EdgeStyling/>
        </>
    );
    if (props.view === 'layout') return (
        <>
            <QuickLayout/>
            <Layout/>
            <ZoomSettings/>
        </>
    );
    if (props.view === 'settings') return (
        <>
            <GraphSettings/>
            <EdgeSettings/>
        </>
    );

    return null;
};

export default connector(GraphDrawer);
