import {
    Alignment,
    Button,
    ButtonGroup,
    NonIdealState
} from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import SterlingDrawer from '../../sterling/SterlingDrawer';
import { setSelected } from './sourceSlice';

const mapState = (state: RootState) => ({
    instance: state.sterlingSlice.instance,
    selected: state.sourceSlice.selected
});

const mapDispatch = {
    setSelected
};

const connector = connect(mapState, mapDispatch);

type SourceDrawerProps = ConnectedProps<typeof connector>;

const SourcePlaceholder: React.FunctionComponent<SourceDrawerProps> = props => (
    <NonIdealState
        title={'No Files'}
        icon={'document'}/>
);

const SourceDrawer: React.FunctionComponent<SourceDrawerProps> = props => {

    const instance = props.instance;

    return <SterlingDrawer.Section title={'Model Sources'}>
        {
            instance
                ? <ButtonGroup
                    alignText={Alignment.LEFT}
                    minimal={true}
                    vertical={true}> {
                    instance.sources().map(source => (
                        <Button
                            active={props.selected === source}
                            icon={'document'}
                            key={source.filename()}
                            onClick={() => props.setSelected(source)}
                            text={source.filename().split(/(\\|\/)/g).pop()}/>
                    ))
                }</ButtonGroup>
                : <SourcePlaceholder {...props}/>
        }
    </SterlingDrawer.Section>
};

export default connector(SourceDrawer);
