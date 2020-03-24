import {
    Button,
    ButtonGroup,
    Menu,
    MenuItem,
    Popover,
    Position
} from '@blueprintjs/core';
import { saveAs } from 'file-saver';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import { showErrorToast } from './components/ScriptToaster';
import { setScript, setStage, } from './scriptSlice';

const mapState = (state: RootState) => ({
    script: state.scriptSlice.script,
    stage: state.scriptSlice.stage
});

const mapDispatch = {
    setScript,
    setStage
};

const connector = connect(mapState, mapDispatch);

type ScriptNavProps = ConnectedProps<typeof connector> & {
    onRequestExecute: () => void
};

class ScriptNav extends React.Component<ScriptNavProps> {

    private readonly _fileinput: React.RefObject<HTMLInputElement>;

    constructor (props: ScriptNavProps) {

        super(props);
        this._fileinput = React.createRef();

    }

    render (): React.ReactNode {

        return (
            <div className={'script-nav bp3-dark'}>
                <input
                    type={'file'}
                    style={{display: 'none'}}
                    onChange={this._onFileChange}
                    ref={this._fileinput}/>
                <ButtonGroup className={'file-menu'} minimal={true}>
                    <Popover position={Position.BOTTOM_LEFT}>
                        <Button icon={'document'} rightIcon={'caret-down'}>File</Button>
                        <Menu>
                            <MenuItem text={'Open...'} icon={'document-open'} onClick={this._onClickOpen}/>
                            <MenuItem text={'Save As...'} icon={'floppy-disk'} onClick={this._onClickSave}/>
                        </Menu>
                    </Popover>
                    <Button icon={'social-media'} onClick={this.props.onRequestExecute}>Execute</Button>
                </ButtonGroup>
                <div className={'script-nav-right'}>
                    <ButtonGroup minimal={true}>
                        <Button
                            active={this.props.stage === 'canvas'}
                            onClick={() => this.props.setStage('canvas')}
                            text={'Canvas'}/>
                        <Button
                            active={this.props.stage === 'svg'}
                            onClick={() => this.props.setStage('svg')}
                            text={'SVG'}/>
                    </ButtonGroup>
                </div>
            </div>
        );

    }

    private _onClickOpen = () => {
        if (this._fileinput.current)
            this._fileinput.current.click();
    };


    private _onClickSave = () => {
        let file = new File([this.props.script], 'script.js', { type: 'text/plain;charset=utf-8' });
        saveAs(file);
    };

    private _onFileChange = () => {
        if (this._fileinput.current) {
            let files = this._fileinput.current.files;
            if (files !== null && files.length) {
                const file = files[0];
                const reader = new FileReader();
                reader.onerror = () => {
                    showErrorToast(`Unable to read ${file.name}`);
                };
                reader.onload = (event: ProgressEvent<FileReader>) => {
                    if (event.target) {
                        this.props.setScript(`${event.target.result}`);
                    }
                };
                reader.readAsText(file);
            }
        }
    };

}

export default connector(ScriptNav);
