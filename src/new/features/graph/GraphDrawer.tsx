import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import LayoutAndProjections from './drawer-views/LayoutAndProjections';
import NodeStyling from './drawer-views/NodeStyling';

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

    if (props.view === 'layout') return <LayoutAndProjections/>;
    if (props.view === 'node') return <NodeStyling/>;

    return null;
};

export default connector(GraphDrawer);
