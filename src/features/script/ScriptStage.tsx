import { ResizeSensor } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import SplitPane from 'react-split-pane';
import { RootState } from '../../rootReducer';
import ScriptEditor from './components/ScriptEditor';
import { showErrorToast } from './components/ScriptToaster';
import StatusBar from './components/StatusBar';
import ScriptNav from './ScriptNav';
import { ScriptRunner } from './ScriptRunner';
import { ScriptStatus, setSize, setStatus } from './scriptSlice';
import localForage from 'localforage';

const mapState = (state: RootState) => ({
    instance: state.sterlingSlice.instance,
    ...state.scriptSlice
});

const mapDispatch = {
    setSize,
    setStatus
};

const connector = connect(mapState, mapDispatch);

type ScriptStageProps = ConnectedProps<typeof connector>;

interface ScriptStageState {
    isReadOnly: boolean
}

class ScriptStage extends React.Component<ScriptStageProps, ScriptStageState> {

    private readonly _canvas: React.RefObject<HTMLCanvasElement>;
    private readonly _svg: React.RefObject<SVGSVGElement>;
    private readonly _runner: ScriptRunner;

    constructor (props: ScriptStageProps) {

        super(props);

        this._canvas = React.createRef();
        this._svg = React.createRef();
        this._runner = new ScriptRunner();

        this.state = {
            isReadOnly: false
        }

    }

    componentDidMount (): void {

        if (this.props.status === ScriptStatus.SUCCESS) {
            this._onRequestExecute();
        }

    }

    componentDidUpdate (prevProps: Readonly<ScriptStageProps>,
                        prevState: Readonly<ScriptStageState>): void {

        if (prevProps.instance !== this.props.instance &&
            this.props.status === ScriptStatus.SUCCESS &&
            this.props.autorun) {
            this._onRequestExecute();
        }

    }

    render (): React.ReactNode {
        return (
            <ResizeSensor onResize={this._onResize}>
                <SplitPane
                    split={'vertical'}
                    defaultSize={'35%'}>
                    <div className={'script-editor'}>
                        <ScriptNav onRequestExecute={this._onRequestExecute}/>
                        <StatusBar status={this.props.status}/>
                        <ScriptEditor
                            onChange={() => {
                                this.props.setStatus(ScriptStatus.PENDING);
                            }}
                            onRequestExecute={this._onRequestExecute}
                            onResize={this._onResize}
                            readOnly={this.state.isReadOnly}/>
                    </div>
                    {
                        this.props.stage === 'canvas'
                            ? <canvas
                                className={'script-stage'}
                                ref={this._canvas}/>
                            : <svg
                                className={'script-stage'}
                                ref={this._svg}/>
                    }
                </SplitPane>
            </ResizeSensor>
        );
    }

    _disableEditor = () => {
        this.setState({
            isReadOnly: true
        });
    };

    _enableEditor = () => {
        this.setState({
            isReadOnly: false
        });
    };

    _onRequestExecute = () => {

        this._disableEditor();

        const s = this.props.stage;

        const script = this.props.script;
        const instance = this.props.instance;
        const stage = s === 'canvas'
            ? this._canvas.current
            : this._svg.current;
        const libraries = this.props.libraries;

        let width = this.props.width;
        let height = this.props.height;

        try {

            // If the script has changed, save it to local storage
            // before moving on to execute
            (new Promise(((resolve, reject) => {
                if (this.props.status === ScriptStatus.SUCCESS) {
                    resolve();
                }
                localForage.setItem('script', this.props.script)
                    .then(resolve)
                    .catch(reject);
            })))

                // Now execute the script
                .then(() =>
                    this._runner
                        .script(script)
                        .libraries(libraries.toArray())
                        .args('instance', s, 'width', 'height')
                        .run(instance, stage, width, height)
                )

                // Set the status to success if everything went okay
                .then(() => {
                    this.props.setStatus(ScriptStatus.SUCCESS);
                })

                // Set the status to error and show a message if something went wrong
                .catch(error => {
                    this.props.setStatus(ScriptStatus.ERROR);
                    showErrorToast(error.message)
                })

                // Enable the editor
                .finally(this._enableEditor);

        } catch (error) {

            showErrorToast(error.message);
            this._enableEditor();

        }

    };

    _onResize = () => {

        const el = this.props.stage === 'canvas'
            ? this._canvas.current
            : this._svg.current;

        if (el) {
            const styles = getComputedStyle(el);
            const width = parseInt(styles.getPropertyValue('width'));
            const height = parseInt(styles.getPropertyValue('height'));
            this.props.setSize([width, height]);
        } else {
            this.props.setSize([null, null]);
        }

    };

}

export default connector(ScriptStage);
