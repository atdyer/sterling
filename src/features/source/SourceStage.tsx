import { NonIdealState } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import AlloyEditor from './components/AlloyEditor';

const mapState = (state: RootState) => ({
    instance: state.sterlingSlice.instance,
    selected: state.sourceSlice.selected,
    welcome: state.sterlingSlice.welcomeTitle,
    welcomeDescription: state.sterlingSlice.welcomeDescription
});

const connector = connect(mapState);

type SourceStageProps = ConnectedProps<typeof connector>;

const SourceStage: React.FunctionComponent<SourceStageProps> = props => {

    if (!props.instance) {
        return (
            <NonIdealState
                description={props.welcomeDescription}
                icon={'document'}
                title={props.welcome}/>
        );
    }

    if (!props.selected) {
        return (
            <NonIdealState
                description={'Choose a File'}
                icon={'document'}
                title={props.welcome}/>
        );
    }

    return (
        <AlloyEditor source={props.selected.source()}/>
    );

};


export default connector(SourceStage);
