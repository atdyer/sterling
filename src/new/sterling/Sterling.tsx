import { FocusStyleManager, ResizeSensor } from '@blueprintjs/core';
import { AlloyInstance } from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import SplitPane from 'react-split-pane';
import { SterlingConnection } from '../../sterling/SterlingConnection';
import { setInstance } from '../alloy/alloySlice';
import { Evaluator } from '../evaluator/Evaluator';
import EvaluatorView, { IEvaluatorProps } from '../evaluator/EvaluatorView';
import GraphSettings from '../features/graph/GraphSettings';
import GraphStage from '../features/graph/GraphStage';
import TableSettings from '../features/table/TableSettings';
import TableStage from '../features/table/TableStage';
import { RootState } from '../rootReducer';
import SterlingDrawer from './SterlingDrawer';
import SterlingNavbar from './SterlingNavbar';
import SterlingSidebar from './SterlingSidebar';
import SterlingStage from './SterlingStage';


FocusStyleManager.onlyShowFocusOnTabs();

// Map redux state to sterling props
const mapState = (state: RootState) => ({
    graph: state.graphSlice.graph,
    mainView: state.sterlingSlice.mainView,
    sideView: state.sterlingSlice.sideView
});

// Actions
const mapDispatch = {
    setInstance
};

// Connector
const connector = connect(mapState, mapDispatch);

// Create props type for things from redux
type SterlingReduxProps = ConnectedProps<typeof connector>;

// Create combined type for all props
export type SterlingProps = SterlingReduxProps & {
    connection: SterlingConnection
}

interface ISterlingState {
    instance: AlloyInstance | null
}

class Sterling extends React.Component<SterlingProps, ISterlingState> {

    private readonly _evaluator: Evaluator;
    private readonly _evaluatorView: React.ComponentType<IEvaluatorProps>;

    constructor (props: SterlingProps) {

        super(props);

        this._evaluator = new Evaluator(props.connection);
        this._evaluatorView = EvaluatorView;

        this.state = {
            instance: null
        };

    }

    componentDidMount (): void {

        this._initializeConnection();

    }

    render (): React.ReactNode {

        const props = this.props;

        return (
            <ResizeSensor onResize={this._resize}>
                <div className={'sterling'}>
                    <SterlingNavbar
                        connection={props.connection}/>
                    <SterlingSidebar/>
                    {
                        props.sideView === null
                            ? this._getStage()
                            : (
                                <SplitPane
                                    split={'vertical'}
                                    defaultSize={350}
                                    minSize={150}
                                    maxSize={-150}
                                    onChange={this._resize}
                                >
                                    { this._getDrawer() }
                                    { this._getStage() }
                                </SplitPane>
                            )
                    }
                </div>
            </ResizeSensor>
        )

    }

    private _getDrawer = (): React.ReactNode => {

        const Evaluator = this._evaluatorView;

        return <SterlingDrawer>
            {
                this.props.sideView === 'evaluator'
                    ? <Evaluator evaluator={this._evaluator}/>
                    : this._getSettings()
            }
        </SterlingDrawer>;

    };

    private _getSettings = (): React.ReactNode => {
        switch(this.props.mainView) {
            case 'graph':
                return <GraphSettings/>;
            case 'table':
                return <TableSettings/>;
            default:
                return null;
        }
    };

    private _getStage = (): React.ReactNode => {

        const view = this.props.mainView;

        return (
            <SterlingStage>
                {
                    view === 'table' ? <TableStage/> :
                    view === 'graph' ? <GraphStage/> : null
                }
            </SterlingStage>
        )

    };

    private _initializeConnection = (): void => {

        const connection = this.props.connection;

        connection
            .on('connect', () => {
                connection.request('current');
            })
            .on('instance', (instance: AlloyInstance) => {
                this.props.setInstance(instance);
            });

        connection.connect();

    };

    private _resize = (): void => {

        this.props.graph.resize();

    }

}

export default connector(Sterling);
