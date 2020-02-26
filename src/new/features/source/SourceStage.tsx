import { NonIdealState } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { COMMENT } from 'highlight.js';

const mapState = (state: RootState) => ({
    instance: state.alloySlice.instance,
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
            showLineNumbers={true}
            style={githubGist}>
            { props.selected.source() }
        </SyntaxHighlighter>
    );

};

SyntaxHighlighter.registerLanguage('alloy', function () {

    let NUMBER_RE = '\\b\\d+';

    return {

        case_insensitive: false,

        keywords: 'abstract all and as assert but check disj ' +
            'else exactly extends fact for fun iden iff implies ' +
            'in Int let lone module no none not one open or pred ' +
            'run set sig some sum univ',

        contains: [

            COMMENT('//', '$', {}),
            COMMENT('--', '$', {}),
            COMMENT('/\\*', '\\*/', {}),

            {
                className: 'number',
                begin: NUMBER_RE,
                relevance: 0
            }
        ]
    };
});


export default connector(SourceStage);
