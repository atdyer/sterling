import {
    Button,
    Classes, Navbar,
    NavbarDivider,
    NavbarHeading
} from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../rootReducer';
import { setMainView } from '../../../sterling/sterlingSlice';

const mapState = (state: RootState) => ({
    view: state.sterlingSlice.mainView
});

const mapDispatch = {
    setMainView
};

const connector = connect(
    mapState,
    mapDispatch
);

type ViewNavigationProps = ConnectedProps<typeof connector>;

const ViewGroup: React.FunctionComponent<ViewNavigationProps> = props => {

    return (
        <Navbar.Group>
            <NavbarHeading className={'nav-heading'}>
                Sterling
            </NavbarHeading>
            <NavbarDivider/>
            <Button
                active={props.view === 'graph'}
                className={Classes.MINIMAL}
                icon={'graph'}
                large={true}
                text={'Graph'}
                onClick={() => props.setMainView('graph')}
            />
            <Button
                active={props.view === 'table'}
                className={Classes.MINIMAL}
                icon={'th'}
                large={true}
                text={'Table'}
                onClick={() => props.setMainView('table')}
            />
            <Button
                active={props.view === 'source'}
                className={Classes.MINIMAL}
                icon={'document'}
                large={true}
                text={'Source'}
                onClick={() => props.setMainView('source')}
            />
            <NavbarDivider/>
        </Navbar.Group>
    );

};

export default connector(ViewGroup);
