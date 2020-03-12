import {
    Button,
    Callout,
    Icon,
    Intent,
    NonIdealState, Tooltip
} from '@blueprintjs/core';
import React from 'react';
import { Evaluator, Expression } from './Evaluator';
import EvaluatorTable from './EvaluatorTable';

export interface IEvaluatorProps {
    evaluator: Evaluator
}

interface IEvaluatorState {
    count: number
    expressions: Expression[]
    history: number
    table: boolean
}

const MESSAGE = 'The evaluator allows you to type in Alloy expressions and see ' +
    'their values. For example, \'univ\' shows the list of atoms. Type an ' +
    'expression below and press Enter to evaluate (you can press the up and down ' +
    'arrow keys to recall old inputs).';

class EvaluatorView extends React.Component<IEvaluatorProps, IEvaluatorState> {

    private readonly _botRef: React.RefObject<HTMLDivElement>;
    private readonly _textRef: React.RefObject<HTMLTextAreaElement>;

    constructor (props: IEvaluatorProps) {

        super(props);

        const evaluator = props.evaluator;
        evaluator.addEventListener('pending', this._onPending);
        evaluator.addEventListener('ready', this._onReady);

        this._botRef = React.createRef();
        this._textRef = React.createRef();

        const expressions = props.evaluator.expressions();
        this.state = {
            count: expressions.length,
            expressions: expressions,
            history: expressions.length,
            table: false
        }

    }

    componentDidMount(): void {

        this._scrollDown();

    }

    componentDidUpdate(prevProps: Readonly<IEvaluatorProps>, prevState: Readonly<IEvaluatorState>): void {

        if (prevState.count !== this.state.count) {

            this._scrollDown();

        }

    }

    componentWillUnmount(): void {

        const evaluator = this.props.evaluator;
        evaluator.removeEventListener('pending', this._onPending);
        evaluator.removeEventListener('ready', this._onReady);

    }

    render (): React.ReactNode {

        const state = this.state;
        const SuccessIcon = <Icon icon={'blank'} iconSize={12}/>;
        const ErrorIcon = <Icon icon={'cross'} iconSize={12}/>;

        state.history < state.count
            ? this._setText(state.expressions[state.history].expression)
            : this._setText('');

        return (
            <div className={'evaluator'}>
                <div className={'evaluator-bar bp3-dark'}>
                    <Tooltip
                        content={'Clear'}
                        hoverOpenDelay={500}
                        intent={Intent.PRIMARY}>
                        <Button
                            small={true}
                            minimal={true}
                            icon={'clean'}
                            onClick={() => {
                                this.props.evaluator.clear();
                                const expressions = this.props.evaluator.expressions();
                                this.setState({
                                    expressions: expressions,
                                    count: expressions.length,
                                    history: expressions.length
                                });
                            }}/>
                    </Tooltip>
                    <Tooltip
                        content={state.table ? 'Display Text' : 'Display Tables'}
                        hoverOpenDelay={500}
                        intent={Intent.PRIMARY}>
                        <Button
                            small={true}
                            minimal={true}
                            icon={state.table ? 'align-left' : 'th'}
                            onClick={() => this.setState({ table: !state.table })}/>
                    </Tooltip>
                </div>
                <div className={'evaluator-output'}>
                    {
                        state.expressions.length
                            ? state.expressions.map(expression => (
                                <Callout
                                    key={expression.id}
                                    icon={expression.error ? ErrorIcon : SuccessIcon}
                                    title={expression.expression}
                                    intent={expression.error ? Intent.DANGER : Intent.NONE}
                                >
                                    {
                                        state.table && isTableable(expression) && typeof expression.result === 'string'
                                            ? <EvaluatorTable result={expression.result}/>
                                            : expression.result
                                    }
                                </Callout>
                            ))
                            : <NonIdealState
                                title={'Evaluator'}
                                description={MESSAGE}
                                icon={'console'}/>
                    }
                    <div ref={this._botRef}/>
                </div>
                <div className={'evaluator-input'}>
                    <textarea
                        autoComplete={'off'}
                        placeholder={'Enter an expression...'}
                        spellCheck={'false'}
                        onKeyDown={this._onKeyDown}
                        ref={this._textRef}
                    />
                </div>
            </div>
        );

    }

    private _onDown = (): void => {

        const textarea = this._textRef.current;

        if (textarea) {

            const pos = textarea.selectionStart;
            const len = textarea.value.length;

            if (pos === len) {

                const history = this.state.history < this.state.count
                    ? this.state.history + 1
                    : this.state.count;

                this.setState({
                    history: history
                });

            }
        }

    };

    private _onEnter = (): void => {

        const textarea = this._textRef.current;

        if (textarea) {

            const value = textarea.value;
            textarea.value = '';

            if (value.length)
                this.props.evaluator.evaluate(value);

        }

    };

    private _onKeyDown = (event: React.KeyboardEvent): void => {
        const key = event.key;
        switch (key) {
            case 'Enter':
                event.preventDefault();
                this._onEnter();
                break;
            case 'ArrowUp':
                this._onUp();
                break;
            case 'ArrowDown':
                this._onDown();
                break;
            default:
                break;
        }
    };

    private _onPending = (): void => {

        this._setActive(false);

    };

    private _onReady = (): void => {

        this._setActive(true);
        const expressions = this.props.evaluator.expressions();
        this.setState({
            count: expressions.length,
            expressions: expressions,
            history: expressions.length
        });

    };

    private _onUp = (): void => {

        const textarea = this._textRef.current;

        if (textarea) {

            if (textarea.selectionStart === 0) {

                const history = this.state.history > 0
                    ? this.state.history - 1
                    : 0;

                this.setState({
                    history: history
                });

            }

        }

    };

    private _scrollDown = (): void => {

        const bottom = this._botRef.current;

        if (bottom) {

            bottom.scrollIntoView();

        }

    };

    private _setActive = (active: boolean): void => {

        const textarea = this._textRef.current;

        if (textarea) {

            textarea.readOnly = !active;

        }

    };

    private _setText = (text: string): void => {

        const textarea = this._textRef.current;

        if (textarea) {

            textarea.value = text;

        }

    };

}

function isTableable (expression: Expression): boolean {
    const r = expression.result;
    return !expression.error
        && typeof r === 'string'
        && r.length > 0
        && r[0] === '{' && r[r.length-1] === '}';
}

export default EvaluatorView;
