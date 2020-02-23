import { Alignment, FormGroup, Switch } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import {
    toggleAxesVisible,
    toggleCollapseSettings,
    toggleGridVisible
} from './graphSettingsSlice';

const mapState = (state: RootState) => ({
    ...state.graphSlice.graphSettingsSlice
});

const mapDispatch = {
    toggleAxesVisible,
    toggleCollapseSettings,
    toggleGridVisible
};

const connector = connect(mapState, mapDispatch);

type GraphSettingsProps = ConnectedProps<typeof connector>;

const GraphSettings: React.FunctionComponent<GraphSettingsProps> = props => (
    <SterlingDrawer.Section
        collapsed={props.collapseSettings}
        onToggle={props.toggleCollapseSettings}
        title={'Graph Settings'}>
        <FormGroup>
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
        </FormGroup>
    </SterlingDrawer.Section>
);

export default connector(GraphSettings);
