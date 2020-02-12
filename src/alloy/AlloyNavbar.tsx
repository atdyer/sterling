import { Button, Navbar, Tag } from '@blueprintjs/core';
import { AlloyInstance } from 'alloy-ts';
import React from 'react';
import SterlingNavbar, { ISterlingNavbarProps } from '../sterling/SterlingNavbar';

interface IAlloyNavbarState {
    command: string,
    connected: boolean,
    ready: boolean
}

class AlloyNavbar extends React.Component<ISterlingNavbarProps, IAlloyNavbarState> {

    state = {
        command: '',
        connected: false,
        ready: false
    };

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
            <SterlingNavbar {...props}>
                <Navbar.Group>
                    {
                        state.command.length > 0 &&
                        <>
                            <Tag
                                minimal={true}>
                                {state.command}
                            </Tag>
                            <Navbar.Divider/>
                        </>
                    }
                    <Button
                        disabled={!state.ready}
                        intent={state.connected ? 'success' : 'danger'}
                        large={true}
                        onClick={this._requestNext}
                        rightIcon={'circle-arrow-right'}
                        text={'Next'}/>
                </Navbar.Group>
            </SterlingNavbar>
        )

    }

    private _requestNext = () => {

        this.props.connection.request('next');

    }

}

export default AlloyNavbar;
