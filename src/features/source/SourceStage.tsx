import { NonIdealState } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { COMMENT } from 'highlight.js';

const STYLE = githubGist;

SyntaxHighlighter.registerLanguage('alloy', function () {

    let NUMBER_RE = '\\b\\d+';

    return {
        // case_insensitive
        case_insensitive: false,

        // keywords
        keywords: 'abstract all and as assert but check disj ' +
            'else exactly expect extends fact for fun iden iff implies ' +
            'in Int let lone module no none not one open or pred ' +
            'run set sig some sum univ',

        // contains
        contains: [

            // hljs.COMMENT
            COMMENT('//', '$', {}),
            COMMENT('--', '$', {}),
            COMMENT('/\\*', '\\*/', {}),

            {
                // className
                className: 'number',
                // begin
                begin: NUMBER_RE,
                // relevance
                relevance: 0
            }
        ]
    };
});

const mapState = (state: RootState) => ({
    instance: state.sterlingSlice.instance,
    selected: state.sourceSlice.selected,
    welcome: state.sterlingSlice.welcomeTitle,
    welcomeDescription: state.sterlingSlice.welcomeDescription
});

const connector = connect(mapState);

type SourceStageProps = ConnectedProps<typeof connector>;

const SourceStage: React.FunctionComponent<SourceStageProps> = props => {

    if (!props.instance) {
        return (
            <NonIdealState
                description={props.welcomeDescription}
                icon={'document'}
                title={props.welcome}/>
        );
    }

    if (!props.selected) {
        return (
            <NonIdealState
                description={'Choose a File'}
                icon={'document'}
                title={props.welcome}/>
        );
    }

    return (
        <SyntaxHighlighter
            className={'source'}
            language={'alloy'}
            showLineNumbers={false}
            style={STYLE}>
            { props.selected.source() }
        </SyntaxHighlighter>
    );

};


export default connector(SourceStage);
