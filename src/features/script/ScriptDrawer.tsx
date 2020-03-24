import { HTMLTable, InputGroup } from '@blueprintjs/core';
import React, { KeyboardEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import SterlingDrawer from '../../sterling/SterlingDrawer';
import ScriptSettings from './drawer-sections/ScriptSettings';
import { packageName } from './ScriptRunner';
import {
    addLibrary,
    setStage,
    toggleAutorun,
    toggleCollapseLibraries,
    toggleCollapseSettings,
    toggleCollapseVariables
} from './scriptSlice';

const mapState = (state: RootState) => ({
    instance: state.sterlingSlice.instance,
    view: state.sterlingSlice.scriptView,
    ...state.scriptSlice
});

const mapDispatch = {
    addLibrary,
    setStage,
    toggleAutorun,
    toggleCollapseLibraries,
    toggleCollapseSettings,
    toggleCollapseVariables
};

const connector = connect(mapState, mapDispatch);

type ScriptDrawerProps = ConnectedProps<typeof connector>;

interface IScriptDrawerState {
    libraryInput: string
}

interface ILinkProps {
    href: string
}

const Link: React.FunctionComponent<ILinkProps> = props => {
    // eslint-disable-next-line react/jsx-no-target-blank
    return <a href={props.href} target={'_blank'} rel={'noreferrer noopener'}>{ props.children }</a>
};

class ScriptDrawer extends React.Component<ScriptDrawerProps, IScriptDrawerState> {

    private _fileinput: React.RefObject<HTMLInputElement>;

    constructor (props: ScriptDrawerProps) {

        super(props);

        this._fileinput = React.createRef();

        this.state = {
            libraryInput: ''
        }

    }

    render (): React.ReactNode {

        const props = this.props;

        return <>
            <ScriptSettings/>
            <SterlingDrawer.Section
                collapsed={props.collapseLibraries}
                onToggle={props.toggleCollapseLibraries}
                title={'Libraries'}>
                <HTMLTable className={'fill'} condensed={true}>
                    <thead>
                    <tr>
                        <th scope={'col'}>Variable</th>
                        <th scope={'col'}>Library</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        props.libraries.toList().map(library => (
                            <tr key={library}>
                                <td>{packageName(library)}</td>
                                <td><Link href={`https://www.jsdelivr.com/package/npm/${packageName(library)}`}>{library}</Link></td>
                            </tr>
                        ))
                    }
                    <tr>
                        <td colSpan={2}>
                            <InputGroup
                                fill={true}
                                placeholder={'Add library'}
                                onChange={this._onChange.bind(this)}
                                onKeyDown={this._onType.bind(this)}
                                value={this.state.libraryInput}/>
                        </td>
                    </tr>
                    </tbody>
                </HTMLTable>
            </SterlingDrawer.Section>
            <SterlingDrawer.Section
                collapsed={props.collapseVariables}
                onToggle={props.toggleCollapseVariables}
                title={'Variables'}>
                <HTMLTable className={'fill'} condensed={true}>
                    <thead>
                    <tr>
                        <th scope={'col'}>Variable</th>
                        <th scope={'col'}>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this._instanceRow() }
                    { this._stageRow() }
                    <tr>
                        <td>width</td>
                        <td>{props.width}</td>
                    </tr>
                    <tr>
                        <td>height</td>
                        <td>{props.height}</td>
                    </tr>
                    </tbody>
                </HTMLTable>
            </SterlingDrawer.Section>
        </>
    }

    private _onChange (event: any): void {
        this.setState({
            libraryInput: event.target.value
        })
    }

    private _onType (event: KeyboardEvent): void {
        if (event.key === 'Enter' && this.state.libraryInput.length) {
            this.props.addLibrary(this.state.libraryInput);
            this.setState({
                libraryInput: ''
            });
        }
    }

    private _canvasRow (): React.ReactNode {

        return <tr>
            <td>canvas</td>
            <td>
                <Link href={'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API'}>
                    {"<canvas>"}
                </Link>
            </td>
        </tr>

    }

    private _instanceRow (): React.ReactNode {

        return <tr>
            <td>instance</td>
            <td>
                {
                    this.props.instance
                        ? <Link href={'https://alloy-js.github.io/alloy-ts/classes/alloyinstance.html'}>AlloyInstance</Link>
                        : "null"
                }
            </td>
        </tr>;

    }

    private _openFile (): void {
        if (this._fileinput.current) {
            this._fileinput.current.click();
        }
    }

    private _stageRow (): React.ReactNode {

        if (this.props.stage === 'canvas') return this._canvasRow();
        if (this.props.stage === 'svg') return this._svgRow();
        return null;

    }

    private _svgRow (): React.ReactNode {

        return <tr>
            <td>svg</td>
            <td>
                <Link href={'https://developer.mozilla.org/en-US/docs/Web/SVG'}>
                    {"<svg>"}
                </Link>
            </td>
        </tr>

    }

}

export default connector(ScriptDrawer);
