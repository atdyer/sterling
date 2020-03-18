import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import ScriptEditor from './components/ScriptEditor';

const mapState = (state: RootState) => ({
    view: state.sterlingSlice.scriptView
});

const connector = connect(mapState);

type ScriptDrawerProps = ConnectedProps<typeof connector>;

const ScriptDrawer: React.FunctionComponent<ScriptDrawerProps> = props => {
    return <ScriptEditor/>;
};

export default connector(ScriptDrawer);
