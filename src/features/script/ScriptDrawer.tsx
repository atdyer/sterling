import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import ScriptProjections from './drawers/ScriptProjections';
import ScriptVariables from './drawers/ScriptVariables';

const mapState = (state: RootState) => ({
    view: state.sterlingSlice.scriptView
});

const connector = connect(mapState);

type ScriptDrawerProps = ConnectedProps<typeof connector>;

const ScriptDrawer: React.FunctionComponent<ScriptDrawerProps> = props => {

    if (props.view === 'projections') return <ScriptProjections/>;
    if (props.view === 'variables') return <ScriptVariables/>;
    return null;

};

export default connector(ScriptDrawer);
