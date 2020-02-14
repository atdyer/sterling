import { Callout, Icon, Intent } from '@blueprintjs/core';
import React from 'react';
import { Evaluator, Expression } from './Evaluator';

export interface IEvaluatorProps {
    evaluator: Evaluator
}

interface IEvaluatorState {
    count: number
    expressions: Expression[]
    history: number
}

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
            history: expressions.length
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

    render (): React.ReactNode {

        const state = this.state;
        const SuccessIcon = <Icon icon={'circle'} iconSize={12}/>;
        const ErrorIcon = <Icon icon={'cross'} iconSize={12}/>;

        state.history < state.count
            ? this._setText(state.expressions[state.history].expression)
            : this._setText('');

        return (
            <div className={'evaluator'}>
                <div className={'evaluator-output'}>
                    {
                        this.state.expressions.map(expression => (
                            <Callout
                                key={expression.id}
                                icon={expression.error ? ErrorIcon : SuccessIcon}
                                title={expression.expression}
                                intent={expression.error ? Intent.DANGER : Intent.NONE}
                            >
                                {expression.result}
                            </Callout>
                        ))
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

export default EvaluatorView;
