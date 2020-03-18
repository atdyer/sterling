import { IResizeEntry, ResizeSensor } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../rootReducer';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/continuecomment';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/scroll/simplescrollbars';
import * as codemirror from 'codemirror';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { setValue } from '../scriptSlice';

const mapState = (state: RootState) => ({
    value: state.scriptSlice.value
});

const mapDispatch = {
    setValue
};

const connector = connect(mapState, mapDispatch);

type ScriptEditorProps = ConnectedProps<typeof connector>;

interface ScriptEditorState {
    value: string
}

class ScriptEditor extends React.Component<ScriptEditorProps, ScriptEditorState> {

    private _editor: codemirror.Editor | null;

    constructor (props: ScriptEditorProps) {
        super(props);
        this._editor = null;
        this.state = {
            value: props.value
        };
    }

    render (): React.ReactNode {
        return (
            <ResizeSensor onResize={this._onResize}>
                <CodeMirror
                    onBeforeChange={(editor, data, value) => {
                        this.setState({value});
                    }}
                    editorDidMount={editor => {
                        this._editor = editor;
                    }}
                    editorWillUnmount={() => {
                        this.props.setValue(this.state.value);
                    }}
                    value={this.state.value}
                    options={{
                        mode: 'javascript',
                        theme: 'material',
                        lineNumbers: true,
                        autoCloseBrackets: true,
                        matchBrackets: true,
                        extraKeys: {
                            'Ctrl-Space': 'autocomplete'
                        },
                        placeholder: 'Type code here...',
                        scrollbarStyle: 'overlay'
                    }}
                />
            </ResizeSensor>
        )
    }

    _onResize = (entries: IResizeEntry[]) => {
        if (this._editor) {
            this._editor.setSize(entries[0].contentRect.width, '100%');
        }
    }

}

export default connector(ScriptEditor);
