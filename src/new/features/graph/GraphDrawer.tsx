import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import Data from './drawer-views/data/Data';
import GraphSettings from './drawer-views/graph-settings/GraphSettings';
import LayoutAndProjections from './drawer-views/layout/Layout';
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

    if (props.view === 'data') return <Data/>;
    if (props.view === 'layout') return <LayoutAndProjections/>;
    if (props.view === 'node') return <NodeStyling/>;
    if (props.view === 'settings') return <GraphSettings/>;

    return null;
};

export default connector(GraphDrawer);
