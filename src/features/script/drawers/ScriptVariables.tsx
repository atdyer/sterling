import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../rootReducer';
import SterlingDrawer from '../../../sterling/SterlingDrawer';
import InstanceTable from '../components/InstanceTable';
import LibraryTable from '../components/LibraryTable';
import StageTable from '../components/StageTable';
import {
    toggleCollapseInstanceVariables,
    toggleCollapseLibraries,
    toggleCollapseStageVariables
} from '../scriptSlice';

const mapState = (state: RootState) => ({
    collapseInstanceVariables: state.scriptSlice.collapseInstanceVariables,
    collapseLibraries: state.scriptSlice.collapseLibraries,
    collapseStageVariables: state.scriptSlice.collapseStageVariables
});

const mapDispatch = {
    toggleCollapseInstanceVariables,
    toggleCollapseLibraries,
    toggleCollapseStageVariables
};

const connector = connect(mapState, mapDispatch);

type ScriptVariablesProps = ConnectedProps<typeof connector>;

const ScriptVariables: React.FunctionComponent<ScriptVariablesProps> = props => {
    return <>
        <SterlingDrawer.Section
            collapsed={props.collapseLibraries}
            onToggle={props.toggleCollapseLibraries}
            title={'Libraries'}>
            <LibraryTable/>
        </SterlingDrawer.Section>
        <SterlingDrawer.Section
            collapsed={props.collapseStageVariables}
            onToggle={props.toggleCollapseStageVariables}
            title={'Stage Variables'}>
            <StageTable/>
        </SterlingDrawer.Section>
        <SterlingDrawer.Section
            collapsed={props.collapseInstanceVariables}
            onToggle={props.toggleCollapseInstanceVariables}
            title={'Instance Variables'}>
            <InstanceTable/>
        </SterlingDrawer.Section>
    </>
};

export default connector(ScriptVariables)
