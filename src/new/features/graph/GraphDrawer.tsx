import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import QuickEdgeStyling from './drawer-views/edge-styling/QuickEdgeStyling';
import Layout from './drawer-views/layout/Layout';
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
type GraphStageProps = ConnectedProps<typeof connector>;

// The graph settings component
const GraphDrawer: React.FunctionComponent<GraphStageProps> = props => {

    if (props.view === 'node') return (
        <>
            <Projections/>
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
        </>
    );
    if (props.view === 'settings') return <GraphSettings/>;

    return null;
};

export default connector(GraphDrawer);
