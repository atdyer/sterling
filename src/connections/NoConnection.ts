import { SterlingConnection } from '../sterling/SterlingConnection';

class NoConnection extends SterlingConnection {

    constructor () {
        super('');
    }

    connect (): void {
    }

    requestCurrentInstance (): boolean {
        return false;
    }

    requestEvaluateExpression (id: number, expression: string): boolean {
        return false;
    }

    requestNextInstance (): boolean {
        return false;
    }

}

export default NoConnection;
