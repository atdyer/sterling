import { ResizeSensor } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import SplitPane from 'react-split-pane';
import { RootState } from '../../rootReducer';
import { AlloyAtom } from './alloy-proxy/AlloyAtom';
import ScriptEditor from './components/ScriptEditor';
import ScriptOverlay from './components/ScriptOverlay';
import { showErrorToast } from './components/ScriptToaster';
import StatusBar from './components/StatusBar';
import ScriptNav from './ScriptNav';
import { ScriptRunner } from './ScriptRunner';
import { ScriptStatus, setSize, setStatus } from './scriptSlice';
import localForage from 'localforage';
import { AlloyInstance } from './alloy-proxy/AlloyInstance'

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
    private readonly _div: React.RefObject<HTMLDivElement>;
    private readonly _svg: React.RefObject<SVGSVGElement>;
    private readonly _runner: ScriptRunner;

    constructor (props: ScriptStageProps) {

        super(props);

        this._canvas = React.createRef();
        this._div = React.createRef();
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

        const isNewInstance = prevProps.instance !== this.props.instance;
        const isNewProjection = prevProps.projections !== this.props.projections;
        const needsRerun = isNewInstance || isNewProjection;

        if (needsRerun &&
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
                    <div className={'script-stage'}>
                        {
                            this.props.stage === 'canvas'
                                ? <canvas
                                    className={'script-stage'}
                                    ref={this._canvas}/>
                                : this.props.stage === 'svg'
                                ? <svg
                                    className={'script-stage'}
                                    ref={this._svg}/>
                                : <div
                                    className={'script-stage'}
                                    ref={this._div}/>
                        }
                        {
                            this.props.overlay && <ScriptOverlay/>
                        }
                    </div>
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
        const projections = new Map(this.props.projections.toKeyedSeq());
        const stage = s === 'canvas'
            ? this._canvas.current
            : s === 'svg'
                ? this._svg.current
                : this._div.current;
        const libraries = this.props.libraries;

        let width = this.props.width;
        let height = this.props.height;

        if (instance) {

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
                    .then(() => {

                        const [varnames, vars] = instance
                            ? instanceVariables(instance, projections)
                            : [[], []];

                        return this._runner
                            .script(script)
                            .libraries(libraries.toArray())
                            .args('instance', s, 'width', 'height', ...varnames)
                            .run(instance, stage, width, height, ...vars)
                    })

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

function instanceVariables (instance: AlloyInstance, projections: Map<string, string>): [string[], any[]] {

    const atoms = instance.atoms();
    const projectAtoms: AlloyAtom[] = [];
    projections.forEach(atomID => {
        const atom = atoms.find(atom => atom.id() === atomID);
        if (!atom)
            throw Error(`Atom ${atomID} not in instance`);
        projectAtoms.push(atom);
    });

    const _instance = instance.project(projectAtoms);
    const _sigs = _instance.signatures();
    const _atoms = _instance.atoms().filter(atom => isNaN(+atom.id()));
    const _fields = _instance.fields();
    const _skolems = _instance.skolems();

    return [[
        ..._sigs.map(varName),
        ..._atoms.map(varName),
        ..._fields.map(varName),
        ..._skolems.map(varName)
    ], [
        ..._sigs,
        ..._atoms,
        ..._fields,
        ..._skolems
    ]];

}

function varName (item: any): string {
    return Reflect.get(item, '__var__');
}

export default connector(ScriptStage);
