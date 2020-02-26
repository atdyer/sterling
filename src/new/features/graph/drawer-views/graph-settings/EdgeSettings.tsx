import { LabelPlacement } from '@atdyer/graph-js';
import { FormGroup, HTMLSelect, NumericInput } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import {
    setBundleFactor,
    setLabelPlacement,
    toggleCollapseEdgeSettings
} from './graphSettingsSlice';

const LABEL_PLACEMENT_OPTIONS = [
    { value: 'center', label: 'Center' },
    { value: 'join', label: 'Join' },
    { value: 'spread', label: 'Spread' }
];

const mapState = (state: RootState) => ({
    ...state.graphSlice.graphSettingsSlice
});

const mapDispatch = {
    setBundleFactor,
    setLabelPlacement,
    toggleCollapseEdgeSettings
};

const connector = connect(mapState, mapDispatch);

type EdgeSettingsProps = ConnectedProps<typeof connector>;

const EdgeSettings: React.FunctionComponent<EdgeSettingsProps> = props => (
    <SterlingDrawer.Section
        collapsed={props.collapseEdgeSettings}
        onToggle={props.toggleCollapseEdgeSettings}
        title={'Edge Settings'}>
        <FormGroup inline={true} label={'Bundle Factor'}>
            <NumericInput
                allowNumericCharactersOnly={true}
                fill={false}
                value={props.bundleFactor}
                min={0}
                minorStepSize={0.001}
                stepSize={0.01}
                majorStepSize={0.1}
                onValueChange={value => props.setBundleFactor(value)}/>
        </FormGroup>
        <FormGroup inline={true} label={'Label Placement'}>
            <HTMLSelect
                minimal={true}
                options={LABEL_PLACEMENT_OPTIONS}
                value={props.edgeLabelPlacement}
                onChange={event => {
                    props.setLabelPlacement(event.target.value as LabelPlacement)
                }}/>
        </FormGroup>
    </SterlingDrawer.Section>
);

export default connector(EdgeSettings);
