import { Callout, Icon } from '@blueprintjs/core';
import React from 'react';
import { Evaluator, Expression } from './Evaluator';

export interface IEvaluatorProps {
    evaluator: Evaluator
}

interface IEvaluatorState {
    expressions: Expression[]
}

class EvaluatorView extends React.Component<IEvaluatorProps, IEvaluatorState> {

    private _textRef: React.RefObject<HTMLTextAreaElement>;

    constructor (props: IEvaluatorProps) {

        super(props);

        const evaluator = props.evaluator;
        evaluator.addEventListener('pending', this._onPending);
        evaluator.addEventListener('ready', this._onReady);

        this._textRef = React.createRef();
        this.state = {
            expressions: props.evaluator.expressions()
        }

    }

    render (): React.ReactNode {

        const SuccessIcon = <Icon icon={'circle'} iconSize={12}/>;
        const ErrorIcon = <Icon icon={'cross'} iconSize={12}/>;

        return <div className={'eval'}>
            <div className={'eval-output'}>
                {
                    this.state.expressions.map(expression => (
                        <Callout key={expression.id}
                                 icon={expression.error ? ErrorIcon : SuccessIcon}
                                 title={expression.expression}
                                 intent={expression.error ? 'danger' : 'none'}
                        >
                            {expression.result}
                        </Callout>
                    ))
                }
            </div>
            <div className={'eval-input'}>
                <textarea autoComplete={'off'}
                          placeholder={'Enter an expression...'}
                          spellCheck={'false'}
                          onKeyDown={this._onKeyDown}
                          ref={this._textRef}>
                </textarea>
            </div>
        </div>

    }

    private _onDown = (): void => {

        const textarea = this._textRef.current;

        if (textarea) {
            const pos = textarea.selectionStart;
            const len = textarea.value.length;
            if (pos === len) {
                console.log('down');
            }
        }

    };

    private _onEnter = (): void => {

        const textarea = this._textRef.current;

        if (textarea) {

            const value = textarea.value;
            textarea.value = '';

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
        this.setState({
            expressions: this.props.evaluator.expressions()
        });

    };

    private _onUp = (): void => {

        const textarea = this._textRef.current;

        if (textarea) {

            if (textarea.selectionStart === 0) {
                console.log('up');
            }

        }

    };

    private _setActive = (active: boolean): void => {

        const textarea = this._textRef.current;

        if (textarea) {

            textarea.readOnly = !active;

        }

    }

}

export default EvaluatorView;
