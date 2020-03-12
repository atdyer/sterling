import { Button } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import { toggleCollapseZoom } from './layoutSlice';

const mapState = (state: RootState) => ({
    collapseZoom: state.graphSlice.layoutSlice.collapseZoom,
    graph: state.graphSlice.graphSlice.graph
});

const mapDispatch = {
    toggleCollapseZoom
};

const connector = connect(mapState, mapDispatch);

type ZoomSettingsProps = ConnectedProps<typeof connector>;

const ZoomSettings: React.FunctionComponent<ZoomSettingsProps> = props => (
    <SterlingDrawer.Section
        collapsed={props.collapseZoom}
        onToggle={props.toggleCollapseZoom}
        title={'Zoom Settings'}>
        <Button
            icon={'home'}
            text={'Default Zoom'}
            minimal={true}
            onClick={() => {
                props.graph.zoomToHome();
            }}/>
        <Button
            icon={'zoom-to-fit'}
            text={'Zoom to Fit'}
            minimal={true}
            onClick={() => {
                props.graph.zoomToFit();
            }}/>
    </SterlingDrawer.Section>
);

export default connector(ZoomSettings);
