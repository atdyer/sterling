import React from 'react';
import * as codemirror from 'codemirror';
import { IResizeEntry, ResizeSensor } from '@blueprintjs/core';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/addon/mode/simple';

// @ts-ignore
codemirror.defineSimpleMode('alloy', {
    start: [
        {regex: /--.*/, token: 'comment'},
        {regex: /\/\*/, token: 'comment', next: 'comment'},
        {regex: /\/\/.*/, token: 'comment'},
        {regex: /\s+-?\b\d+\b/, token: 'number'},
        {regex: /(?:abstract|all|and|as|assert|but|check|disj|else|exactly|expect|extends|fact|for|fun|iden|iff|implies|in|Int|int|let|lone|module|no|none|not|one|open|or|pred|run|set|sig|some|sum|univ)\b/, token: "keyword"}
    ],
    comment: [
        {regex: /.*?\*\//, token: 'comment', next: 'start'},
        {regex: /.*/, token: 'comment'},
        {regex: /\/\/.*/, token: 'comment'}
    ],
    meta: {
        lineComment: '--'
    }
});

interface IAlloyEditorProps {
    source: string
}

class AlloyEditor extends React.Component<IAlloyEditorProps> {

    private _editor: codemirror.Editor | null;

    constructor (props: IAlloyEditorProps) {

        super(props);

        this._editor = null;

    }

    render (): React.ReactNode {

        return (
            <ResizeSensor onResize={this._onResize}>
                <CodeMirror
                    editorDidMount={editor => {
                        this._editor = editor;
                    }}
                    value={this.props.source}
                    options={{
                        lineNumbers: true,
                        mode: 'alloy',
                        readOnly: true,
                        theme: 'neo'
                    }}
                />
            </ResizeSensor>
        )

    }

    private _onResize = (entries: IResizeEntry[]) => {
        if (this._editor) {
            this._editor.setSize(entries[0].contentRect.width, '100%');
        }
    }

}

export default AlloyEditor;
