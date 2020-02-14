import { FocusStyleManager } from '@blueprintjs/core';
import { AlloyInstance } from 'alloy-ts';
import React from 'react';
import SplitPane from 'react-split-pane';
import { Evaluator } from './evaluator/Evaluator';
import { SterlingConnection } from '../sterling/SterlingConnection';
import EvaluatorView, { IEvaluatorProps } from './evaluator/EvaluatorView';
import SterlingDrawer from './SterlingDrawer';
import SterlingNavbar, { ISterlingNavbarItem } from './SterlingNavbar';
import SterlingSidebar, { ISterlingSidebarItem } from './SterlingSidebar';
import SterlingStage from './SterlingStage';
import { SideView, MainView } from './SterlingTypes';

FocusStyleManager.onlyShowFocusOnTabs();

interface ISterlingProps {

    connection: SterlingConnection

}

interface ISterlingState {

    instance: AlloyInstance | null
    sideView: SideView
    mainView: MainView

}

class Sterling extends React.Component<ISterlingProps, ISterlingState> {

    private readonly _mainViews: ISterlingNavbarItem[];
    private readonly _sideViews: ISterlingSidebarItem[];

    private readonly _evaluator: Evaluator;
    private readonly _evaluatorView: React.ComponentType<IEvaluatorProps>;

    constructor (props: ISterlingProps) {

        super(props);

        this._mainViews = getMainViews();
        this._sideViews = getSideViews();

        this.state = {
            instance: null,
            sideView: null,
            mainView: 'graph',
        };

        this._evaluator = new Evaluator(props.connection);
        this._evaluatorView = EvaluatorView;

    }

    componentDidMount (): void {

        this._initializeConnection();

    }

    render (): React.ReactNode {

        const props = this.props;
        const state = this.state;

        return (
            <div className={'sterling'}>
                <SterlingNavbar
                    connection={props.connection}
                    items={this._mainViews}
                    view={state.mainView}
                    onPickView={this._onPickMainView}
                />
                <SterlingSidebar
                    items={this._sideViews}
                    view={state.sideView}
                    onPickView={this._onPickSideView}
                />
                {
                    state.sideView === null
                        ? this._getStage()
                        : (
                            <SplitPane
                                split={'vertical'}
                                defaultSize={350}
                                minSize={150}
                                maxSize={-150}
                            >
                                { this._getDrawer() }
                                { this._getStage() }
                            </SplitPane>
                        )
                }
            </div>
        )

    }

    private _getDrawer = (): React.ReactNode => {

        const Evaluator = this._evaluatorView;

        return <SterlingDrawer>
            {
                this.state.sideView === 'evaluator'
                    ? <Evaluator evaluator={this._evaluator}/>
                    : null
            }
        </SterlingDrawer>;

    };

    private _getStage = (): React.ReactNode => {

        return <SterlingStage/>;

    };

    private _initializeConnection = (): void => {

        const connection = this.props.connection;

        connection
            .on('connect', () => {
                connection.request('current');
            })
            .on('instance', (instance: AlloyInstance) => {

            });

        connection.connect();

    };

    private _onPickMainView = (view: MainView): void => {

        this.setState({
            mainView: view
        });

    };

    private _onPickSideView = (view: SideView): void => {

        this.setState({
            sideView: view
        });

    };

}

function getMainViews (): ISterlingNavbarItem[] {
    return [{
        view: 'graph',
        label: 'Graph',
        icon: 'graph'
    }, {
        view: 'table',
        label: 'Table',
        icon: 'th'
    }];
}

function getSideViews (): ISterlingSidebarItem[] {
    return [{
        view: 'settings',
        icon: 'settings',
        label: 'View Settings'
    }, {
        view: 'evaluator',
        icon: 'console',
        label: 'Evaluator'
    }];
}

export default Sterling;
