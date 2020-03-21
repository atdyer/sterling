import { IResizeEntry, ResizeSensor } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../rootReducer';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/comment/continuecomment';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/scroll/simplescrollbars';
import * as codemirror from 'codemirror';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { setValue } from '../scriptSlice';

const mapState = (state: RootState) => ({
    script: state.scriptSlice.script
});

const mapDispatch = {
    setValue
};

const connector = connect(mapState, mapDispatch);

type ScriptEditorProps = ConnectedProps<typeof connector> & {
    onChange?: () => void
    onRequestExecute: () => void
    onResize?: () => void
    readOnly: boolean
};

class ScriptEditor extends React.Component<ScriptEditorProps> {

    private _editor: codemirror.Editor | null;

    constructor (props: ScriptEditorProps) {

        super(props);

        this._editor = null;

    }

    render (): React.ReactNode {
        return (
            <ResizeSensor onResize={this._onResize}>
                <CodeMirror
                    onBeforeChange={(editor, data, value) => {
                        this.props.setValue(value);
                    }}
                    onChange={this.props.onChange}
                    editorDidMount={editor => {
                        this._editor = editor;
                    }}
                    value={this.props.script}
                    options={{
                        readOnly: this.props.readOnly,
                        mode: 'javascript',
                        theme: 'material',
                        lineNumbers: true,
                        tabSize: 2,
                        autoCloseBrackets: true,
                        matchBrackets: true,
                        extraKeys: {
                            'Ctrl-Space': 'autocomplete',
                            'Ctrl-Enter': this.props.onRequestExecute,
                            'Ctrl-/': 'toggleComment',
                            'Tab': function (cm: codemirror.Editor) {
                                let unit = cm.getOption('indentUnit') || 0;
                                let spaces = Array(unit + 1).join(' ');
                                cm.replaceSelection(spaces);
                            }
                        },
                        placeholder: 'Type code here...',
                        scrollbarStyle: 'overlay'
                    }}
                />
            </ResizeSensor>
        )
    }

    private _onResize = (entries: IResizeEntry[]) => {
        if (this._editor) {
            this._editor.setSize(entries[0].contentRect.width, '100%');
        }
        if (this.props.onResize) {
            this.props.onResize();
        }
    };

}

export default connector(ScriptEditor);
