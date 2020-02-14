import { SterlingConnection } from '../../sterling/SterlingConnection';
import { EventDispatcher } from '../../util/EventDispatcher';

export interface Expression {
    id: number
    expression: string
    error: boolean
    result: null | boolean | number | string
}

class Evaluator extends EventDispatcher {

    private _connection: SterlingConnection;
    private _expressions: Expression[];
    private _pending: Expression | null;

    protected static _nextid: number = 0;

    constructor (connection: SterlingConnection) {

        super();

        this._connection = connection;
        this._expressions = [];
        this._pending = null;

        connection.on('eval', this._parse.bind(this));

    }

    evaluate (expression: string): void {

        this._request({
            id: Evaluator._nextid++,
            error: false,
            expression: expression,
            result: null
        });

    }

    expressions (): Expression[] {

        return this._expressions;

    }

    private _parse (response: string): void {

        const expression = this._pending;
        const tokens = response.match(/(-?\d+):(.*)/);

        if (tokens === null) return;

        const id = parseInt(tokens[1]);

        if (expression && expression.id === id) {

            const result = tokens[2].trim();

            if (result.slice(0, 4) === 'ERR:') {
                expression.result = result.slice(4);
                expression.error = true;
            }
            else {
                expression.result = result;
                expression.error = false;
            }

            this._expressions.push(expression);
            this._setPending(null);

        }

    }

    private _request (expression: Expression): void {

        this._setPending(expression);

        const request = `EVL:${expression.id}:${expression.expression}`;

        this._connection.request(request);

    }

    private _setPending (expression: Expression | null): void {

        this._pending = expression;

        if (expression !== null) {

            this.dispatchEvent({
                type: 'pending'
            });

        } else {
            
            this.dispatchEvent({
                type: 'ready'
            });
            
        }

    }

}

export {
    Evaluator
}
