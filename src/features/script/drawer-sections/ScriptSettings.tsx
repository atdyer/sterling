import {
    Alignment,
    Button,
    ButtonGroup,
    FormGroup,
    Switch
} from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../rootReducer';
import SterlingDrawer from '../../../sterling/SterlingDrawer';
import { saveAs } from 'file-saver';
import { showErrorToast } from '../components/ScriptToaster';
import {
    setScript,
    setStage,
    toggleAutorun,
    toggleCollapseSettings
} from '../scriptSlice';

const mapState = (state: RootState) => ({
    autorun: state.scriptSlice.autorun,
    collapseSettings: state.scriptSlice.collapseSettings,
    script: state.scriptSlice.script,
    stage: state.scriptSlice.stage
});

const mapDispatch = {
    setScript,
    setStage,
    toggleAutorun,
    toggleCollapseSettings
};

const connector = connect(mapState, mapDispatch);

type ScriptSettingsProps = ConnectedProps<typeof connector>;

class ScriptSettings extends React.Component<ScriptSettingsProps> {

    private _fileinput: React.RefObject<HTMLInputElement>;

    constructor (props: ScriptSettingsProps) {
        super(props);
        this._fileinput = React.createRef();
    }

    render (): React.ReactNode {
        return (
            <SterlingDrawer.Section
                collapsed={this.props.collapseSettings}
                onToggle={this.props.toggleCollapseSettings}
                title={'Script Settings'}>
                <Switch
                    alignIndicator={Alignment.RIGHT}
                    checked={this.props.autorun}
                    label={'Auto run on next instance'}
                    onChange={this.props.toggleAutorun}/>
                <FormGroup inline={true} label={'Stage type'}>
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
                </FormGroup>
                <FormGroup inline={true} label={'File'}>
                    <ButtonGroup minimal={true}>
                        <Button text={'Open...'} onClick={this._onClickOpen}/>
                        <Button text={'Save As...'} onClick={this._onClickSave}/>
                        <input
                            type={'file'}
                            style={{display: 'none'}}
                            onChange={this._onFileChange}
                            ref={this._fileinput}/>
                    </ButtonGroup>
                </FormGroup>
            </SterlingDrawer.Section>
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

export default connector(ScriptSettings);
