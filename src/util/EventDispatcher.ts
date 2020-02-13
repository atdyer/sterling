export interface Event {
    type: string,
    [key: string]: any
}

class EventDispatcher {

    private _listeners?: {[key: string]: ((event: any) => void)[]};

    addEventListener (type: string, listener: (event: any) => void): this {

        if (this._listeners === undefined) this._listeners = {};

        const listeners = this._listeners;

        if (listeners[type] === undefined) {
            listeners[type] = [];
        }

        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }

        return this;

    }

    dispatchEvent (event: Event): this {

        if (this._listeners === undefined) return this;

        const listenerarray = this._listeners[event.type];

        if (listenerarray !== undefined) {

            event.target = this;

            const arraycopy = listenerarray.slice();

            arraycopy.forEach(callback => {
                callback.call(this, event);
            });

        }

        return this;

    }

    hasEventListener (type: string, listener: (event: any) => void): boolean {

        if (this._listeners === undefined) return false;

        const listeners = this._listeners;

        return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;

    }

    removeEventListener (type: string, listener: (event: any) => void): this {

        if (this._listeners === undefined) return this;

        const listenerarray = this._listeners[type];

        if (listenerarray !== undefined) {
            const index = listenerarray.indexOf(listener);
            if (index !== -1) {
                listenerarray.splice(index, 1);
            }
        }

        return this;

    }

}

export {
    EventDispatcher
}
