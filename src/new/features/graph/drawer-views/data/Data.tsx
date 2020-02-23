import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import Expressions from './components/Expressions';
import Projections from './components/Projections';
import Relations from './components/Relations';
import Signatures from './components/Signatures';

const mapState = (state: RootState) => ({
    ...state.graphSlice.dataSlice
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type DataProps = ConnectedProps<typeof connector>;

const Data: React.FunctionComponent<DataProps> = props => {

    return (
        <>
            <Projections/>
            <Signatures/>
            <Relations/>
            <Expressions/>
        </>
    );

};

export default connector(Data);
