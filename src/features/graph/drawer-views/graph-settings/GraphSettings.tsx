import { Alignment, Switch } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import {
    toggleAxesVisible,
    toggleCollapseGraphSettings,
    toggleGridVisible
} from './graphSettingsSlice';

const mapState = (state: RootState) => ({
    ...state.graphSlice.graphSettingsSlice
});

const mapDispatch = {
    toggleAxesVisible,
    toggleCollapseGraphSettings,
    toggleGridVisible
};

const connector = connect(mapState, mapDispatch);

type GraphSettingsProps = ConnectedProps<typeof connector>;

const GraphSettings: React.FunctionComponent<GraphSettingsProps> = props => (
    <SterlingDrawer.Section
        collapsed={props.collapseGraphSettings}
        onToggle={props.toggleCollapseGraphSettings}
        title={'Graph Settings'}>
        <Switch
            alignIndicator={Alignment.RIGHT}
            checked={props.axesVisible}
            label={'Display Axes'}
            onChange={props.toggleAxesVisible}/>
        <Switch
            alignIndicator={Alignment.RIGHT}
            checked={props.gridVisible}
            label={'Display Grid'}
            onChange={props.toggleGridVisible}/>
    </SterlingDrawer.Section>
);

export default connector(GraphSettings);
