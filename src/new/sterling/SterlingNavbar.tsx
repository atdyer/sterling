import {
    Button,
    Classes,
    Navbar,
    NavbarDivider,
    NavbarHeading,
    Tag
} from '@blueprintjs/core';
import { AlloyInstance } from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { SterlingConnection } from '../../sterling/SterlingConnection';
import { RootState } from '../rootReducer';
import { setMainView } from './sterlingSlice';

// Map redux state to navbar props
const mapState = (state: RootState) => ({
    view: state.sterlingSlice.mainView
});

// Actions
const mapDispatch = {
    setMainView
};

// Connect the two
const connector = connect(
    mapState,
    mapDispatch
);

// Create a props type for things from redux
type SterlingNavbarReduxProps = ConnectedProps<typeof connector>;

// Create a combined type for all props
export type SterlingNavbarProps = SterlingNavbarReduxProps & {
    connection: SterlingConnection
}

// Create an interface for the state
interface ISterlingNavbarState {
    command: string
    connected: boolean
    ready: boolean
}

class SterlingNavbar extends React.Component<SterlingNavbarProps, ISterlingNavbarState> {

    constructor (props: SterlingNavbarProps) {

        super(props);

        this.state = {
            command: '',
            connected: false,
            ready: false
        }

    }

    componentDidMount (): void {

        const connection = this.props.connection;

        connection
            .on('connect', () => {
                this.setState({connected: true});
            })
            .on('disconnect', () => {
                this.setState({connected: false, ready: false});
            })
            .on('instance', (instance: AlloyInstance) => {
                this.setState({
                    command: instance.command(),
                    ready: this.state.connected
                });
            });

    }

    render (): React.ReactNode {

        const props = this.props;
        const state = this.state;

        return (
            <Navbar fixedToTop className={'nav bp3-dark'}>
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
                    <NavbarDivider/>
                </Navbar.Group>
                <Navbar.Group>
                    {
                        state.command.length > 0 &&
                        <>
                            <Tag minimal={true}>
                                {state.command}
                            </Tag>
                            <NavbarDivider/>
                        </>
                    }
                    <Button disabled={!state.ready}
                            intent={state.connected ? 'success' : 'danger'}
                            large={true}
                            onClick={this._requestNext}
                            rightIcon={'circle-arrow-right'}
                            text={'Next'}
                    />
                </Navbar.Group>
            </Navbar>
        )

    }

    private _requestNext = () => {

        this.props.connection.request('next');

    }

}

export default connector(SterlingNavbar);
