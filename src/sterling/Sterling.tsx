import { NonIdealState } from '@blueprintjs/core';
import React from 'react';
import { SterlingConnection } from './SterlingConnection';
import { ISterlingNavbarProps } from './SterlingNavbar';
import { ISterlingUIView } from './SterlingTypes';

interface ISterlingProps {
    connection: SterlingConnection,
    navbar: React.ComponentType<ISterlingNavbarProps>,
    views: ISterlingUIView[],
    message?: string
}

interface ISterlingState {
    data: any[],
    view: ISterlingUIView
}

class Sterling extends React.Component<ISterlingProps, ISterlingState> {

    constructor (props: ISterlingProps) {

        super(props);

        this.state = {
            data: [],
            view: props.views[0]
        }

    }

    componentDidMount (): void {

        this._initializeConnection();

    }

    render (): React.ReactNode {

        const props = this.props;
        const state = this.state;
        const Navbar = props.navbar;

        return (
            <div className={'sterling'}>
                <Navbar
                    connection={props.connection}
                    onRequestView={this._setView}
                    view={state.view}
                    views={props.views}/>
                {
                    state.data.length
                        ? this._views()
                        : this._placeholder()
                }
            </div>
        )

    }

    private _initializeConnection = () => {

        const connection = this.props.connection;

        connection
            .on('connect', () => {
                connection.request('current');
            })
            .on('instance', (instance: any) => {
                const transforms = this.props.views.map(view => view.transform);
                this.setState({
                    data: transforms.map(t => t ? t(instance) : instance)
                });
            });

        connection.connect();

    };

    private _placeholder = (): React.ReactNode => {

        return <NonIdealState
            description={this.props.message || 'Nothing to display'}
            icon={this.state.view.icon}
            title={'Welcome to Sterling'}/>

    };

    private _setView = (view: ISterlingUIView) => {

        this.setState({view: view});

    };

    private _views = (): React.ReactNode => {

        const props = this.props;
        const state = this.state;

        return <div className={'sterling-view'}>
            {
                props.views.map((view: ISterlingUIView, i: number) => {

                    const View = view.view;
                    const data = state.data[i];

                    return <View
                        connection={props.connection}
                        data={data}
                        key={view.name}
                        visible={state.view === view}/>

                })
            }
        </div>

    }

}

export default Sterling;

