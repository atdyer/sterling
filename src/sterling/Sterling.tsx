import { FocusStyleManager, ResizeSensor } from '@blueprintjs/core';
import { AlloyInstance } from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import SplitPane from 'react-split-pane';
import { Evaluator } from '../evaluator/Evaluator';
import EvaluatorView, { IEvaluatorProps } from '../evaluator/EvaluatorView';
import GraphDrawer from '../features/graph/GraphDrawer';
import GraphStage from '../features/graph/GraphStage';
import StaticNavbar from '../features/nav/StaticNavbar';
import SterlingNavbar from '../features/nav/SterlingNavbar';
import SourceDrawer from '../features/source/SourceDrawer';
import SourceStage from '../features/source/SourceStage';
import TableDrawer from '../features/table/TableDrawer';
import TableStage from '../features/table/TableStage';
import { RootState } from '../rootReducer';
import { SterlingConnection } from './SterlingConnection';
import SterlingDrawer from './SterlingDrawer';
import SterlingKeyboard from './SterlingKeyboard';
import SterlingSidebar from './SterlingSidebar';
import { setInstance } from './sterlingSlice';
import SterlingStage from './SterlingStage';


FocusStyleManager.onlyShowFocusOnTabs();

// Map redux state to sterling props
const mapState = (state: RootState) => ({
    graph: state.graphSlice.graphSlice.graph,
    ...state.sterlingSlice
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
        const drawerOpen =
            (props.mainView === 'graph' && props.graphView !== null) ||
            (props.mainView === 'table' && props.tableView !== null) ||
            (props.mainView === 'source' && props.sourceView !== null);

        return (
                <ResizeSensor onResize={this._resize}>
                    <SterlingKeyboard>
                        {
                            this._getNavbar()
                        }
                        <SterlingSidebar/>
                        {
                            !drawerOpen
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
                    </SterlingKeyboard>
                </ResizeSensor>
        )

    }

    private _getDrawer = (): React.ReactNode => {

        const props = this.props;
        const Evaluator = this._evaluatorView;
        const evalActive =
            (props.mainView === 'graph' && props.graphView === 'evaluator') ||
            (props.mainView === 'table' && props.tableView === 'evaluator') ||
            (props.mainView === 'source' && props.sourceView === 'evaluator');

        return <SterlingDrawer>
            {
                evalActive
                    ?
                        <Evaluator evaluator={this._evaluator}/>
                    :
                        props.mainView === 'graph' ? <GraphDrawer/> :
                        props.mainView === 'table' ? <TableDrawer/> :
                        props.mainView === 'source' ? <SourceDrawer/> :
                        null

            }
        </SterlingDrawer>;

    };

    private _getNavbar = (): React.ReactNode => {

        const target = process.env.REACT_APP_BUILD_TARGET;
        switch (target) {
            case 'static':
                return <StaticNavbar/>;
            case 'alloy':
            case 'forge':
            default:
                return <SterlingNavbar connection={this.props.connection}/>;

        }

    };

    private _getStage = (): React.ReactNode => {

        const view = this.props.mainView;

        return (
            <SterlingStage>
                {
                    view === 'table' ? <TableStage/> :
                    view === 'graph' ? <GraphStage/> :
                    view === 'source' ? <SourceStage/> : null
                }
            </SterlingStage>
        )

    };

    private _initializeConnection = (): void => {

        const connection = this.props.connection;

        connection.addEventListener('connect', () => {
            connection.requestCurrentInstance();
        });

        connection.addEventListener('instance', event => {
            this.props.setInstance(event.instance);
        });

        connection.connect();

    };

    private _resize = (): void => {

        this.props.graph.resize();

    }

}

export default connector(Sterling);
