import { CircleLayout } from '@atdyer/graph-js';
import { Button, ButtonGroup } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../rootReducer';
import SterlingDrawer from '../../../sterling/SterlingDrawer';

// Map redux state to layout settings props
const mapState = (state: RootState) => ({
    graph: state.graphSlice.graph
});

// Create connector
const connector = connect(mapState);

// Create props for things from redux
type LayoutProjectionsProps = ConnectedProps<typeof connector>;

// The layout and projections component
const LayoutAndProjections: React.FunctionComponent<LayoutProjectionsProps> = props => {
    return (
        <SterlingDrawer.Section
            collapsed={false}
            onToggle={() => {}}
            title={'Layout'}>
            <ButtonGroup minimal={true}>
                <Button icon={'layout-circle'} onClick={() => {
                    if (props.graph) {
                        const circle = new CircleLayout();
                        circle.apply(props.graph);
                        props.graph.update();
                    }
                }}/>
            </ButtonGroup>
        </SterlingDrawer.Section>
    );
};

export default connector(LayoutAndProjections);
