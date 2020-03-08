import { Button, Navbar, NavbarDivider, Tag } from '@blueprintjs/core';
import React from 'react';
import { SterlingConnection } from '../../sterling/SterlingConnection';
import ViewGroup from './components/ViewGroup';

export interface SterlingNavbarProps {
    connection: SterlingConnection
}

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
            .addEventListener('connect', () => {
                this.setState({ connected: true });
            })
            .addEventListener('disconnect', () => {
                this.setState({ connected: false, ready: false });
            })
            .addEventListener('instance', event => {
                this.setState({
                    command: event.instance.command(),
                    ready: this.state.connected
                });
            });

    }

    render (): React.ReactNode {

        const state = this.state;

        return (
            <Navbar fixedToTop className={'nav bp3-dark'}>
                <ViewGroup/>
                <Navbar.Group className={'collapsing'}>
                    {
                        state.command.length > 0 &&
                        <Tag minimal={true}>
                            {state.command}
                        </Tag>
                    }
                    <NavbarDivider/>
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

        this.props.connection.requestNextInstance();

    }

}

export default SterlingNavbar;
