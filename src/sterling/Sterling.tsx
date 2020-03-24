import { FocusStyleManager, ResizeSensor } from '@blueprintjs/core';
import { AlloyInstance } from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import SplitPane from 'react-split-pane';
import { Evaluator } from '../evaluator/Evaluator';
import EvaluatorView, { IEvaluatorProps } from '../evaluator/EvaluatorView';
import GraphDrawer from '../features/graph/GraphDrawer';
import StaticNavbar from '../features/nav/StaticNavbar';
import SterlingNavbar from '../features/nav/SterlingNavbar';
import { showErrorToast } from '../features/script/components/ScriptToaster';
import ScriptDrawer from '../features/script/ScriptDrawer';
import SourceDrawer from '../features/source/SourceDrawer';
import TableDrawer from '../features/table/TableDrawer';
import { RootState } from '../rootReducer';
import { SterlingConnection } from './SterlingConnection';
import SterlingDrawer from './SterlingDrawer';
import SterlingKeyboard from './SterlingKeyboard';
import SterlingSidebar from './SterlingSidebar';
import { setInstance } from './sterlingSlice';
import { setScript } from '../features/script/scriptSlice';
import SterlingStage from './SterlingStage';
import localForage from 'localforage';


FocusStyleManager.onlyShowFocusOnTabs();

// Map redux state to sterling props
const mapState = (state: RootState) => ({
    graph: state.graphSlice.graphSlice.graph,
    ...state.sterlingSlice
});

// Actions
const mapDispatch = {
    setInstance,
    setScript
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
        localForage.getItem('script')
            .then(script => {
                this.props.setScript(`${script}`);
            })
            .catch((error: Error) => {
                showErrorToast(`${error.name}: ${error.message}`);
            });

    }

    render (): React.ReactNode {

        const props = this.props;
        const drawerOpen =
            (props.mainView === 'graph' && props.graphView !== null) ||
            (props.mainView === 'table' && props.tableView !== null) ||
            (props.mainView === 'script' && props.scriptView !== null) ||
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
                                ? <SterlingStage/>
                                : (
                                    <SplitPane
                                        split={'vertical'}
                                        defaultSize={350}
                                        minSize={150}
                                        maxSize={-150}
                                        onChange={this._resize}
                                    >
                                        { this._getDrawer() }
                                        { <SterlingStage/> }
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
            (props.mainView === 'script' && props.scriptView === 'evaluator') ||
            (props.mainView === 'source' && props.sourceView === 'evaluator');

        return <SterlingDrawer>
            {
                evalActive
                    ?
                        <Evaluator evaluator={this._evaluator}/>
                    :
                        props.mainView === 'graph' ? <GraphDrawer/> :
                        props.mainView === 'table' ? <TableDrawer/> :
                        props.mainView === 'script' ? <ScriptDrawer/> :
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

        if (this.props.mainView === 'graph')
            this.props.graph.resize();

    }

}

export default connector(Sterling);
