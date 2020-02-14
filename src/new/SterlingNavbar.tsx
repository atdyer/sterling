import {
    Button, Classes,
    IconName,
    MaybeElement,
    Navbar, NavbarDivider,
    NavbarHeading, Tag
} from '@blueprintjs/core';
import { AlloyInstance } from 'alloy-ts';
import React from 'react';
import { SterlingConnection } from '../sterling/SterlingConnection';
import { MainView } from './SterlingTypes';

export interface ISterlingNavbarItem {

    view: MainView
    label: string
    icon: IconName | MaybeElement

}

export interface ISterlingNavbarProps {

    connection: SterlingConnection
    items: ISterlingNavbarItem[]
    view: MainView
    onPickView: (item: MainView) => void

}

interface ISterlingNavbarState {

    command: string
    connected: boolean
    ready: boolean

}

class SterlingNavbar extends React.Component<ISterlingNavbarProps, ISterlingNavbarState> {

    constructor (props: ISterlingNavbarProps) {

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
                    {
                        props.items.map(item => (
                            <Button key={item.label}
                                    className={Classes.MINIMAL}
                                    active={item.view === props.view}
                                    large={true}
                                    icon={item.icon}
                                    text={item.label}
                                    onClick={() => props.onPickView(item.view)}
                            />
                        ))
                    }
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

export default SterlingNavbar;
