import { AlloyInstance } from 'alloy-ts';
import { EventDispatcher } from '../util/EventDispatcher';


/**
 * Events dispatched by a SterlingConnectiong:
 *   connect: connection established
 *   disconnect: connection lost
 *   error: an error occurred
 *   eval: a response from the evaluator
 *   instance: a new instance received
 */
abstract class SterlingConnection extends EventDispatcher {

    protected _url: string;
    protected _ws: WebSocket | null;

    private _auto_reconnect: boolean;
    private _auto_reconnect_interval: number;
    private _connected: boolean;

    _heartbeat_count: number;
    _heartbeat_id: number;
    _heartbeat_interval: number;
    _heartbeat_latency: DOMHighResTimeStamp;
    _heartbeat_timestamp: DOMHighResTimeStamp;

    protected constructor (url: string) {

        super();

        this._url = url;
        this._ws = null;

        this._auto_reconnect = false;
        this._auto_reconnect_interval = 5000;
        this._connected = false;

        this._heartbeat_count = 0;
        this._heartbeat_id = 0;
        this._heartbeat_interval = 15000;
        this._heartbeat_latency = 0;
        this._heartbeat_timestamp = 0;

    }

    /**
     * Establish a connection with a data provider
     */
    connect (): void {

        if (this._ws) {
            this._ws.onclose = null;
            this._ws.close();
        }

        this._initializeConnection();

    }

    requestCurrentInstance (): boolean {

        return this._request('current');

    }

    requestEvaluateExpression (id: number, expression: string): boolean {

        return this._request(`EVL:${id}:${expression}`);

    }

    requestNextInstance (): boolean {

        return this._request('next');

    }

    private _handleEval (data: string): void {

        this.dispatchEvent({
            type: 'eval',
            data: data
        });

    }

    private _handlePong (): void {

        this._heartbeat_latency += performance.now() - this._heartbeat_timestamp;
        this._heartbeat_count += 1;

    }

    private _handleXML (data: string): void {

        if (data.length) {
            try {
                this.dispatchEvent({
                    type: 'instance',
                    instance: new AlloyInstance(data)
                });
            } catch (e) {
                this.dispatchEvent({
                    type: 'error',
                    message: 'Invalid instance data'
                });
            }
        }

    }

    private _initializeConnection () {

        this._ws = new WebSocket(this._url);
        this._ws.onopen = this._onOpen.bind(this);
        this._ws.onclose = this._onClose.bind(this);
        this._ws.onerror = this._onError.bind(this);
        this._ws.onmessage = this._onMessage.bind(this);

    }

    private _onClose (e: Event): void {

        this._connected = false;
        this._ws = null;
        if (this._auto_reconnect) this._reconnect();
        this.dispatchEvent({ type: 'disconnect' });

    }

    private _onError (e: Event): void {

        this.dispatchEvent({ type: 'error' });

    }

    private _onMessage (e: MessageEvent): void {

        this._resetHeartbeat();
        let header = e.data.slice(0, 4);
        let data = e.data.slice(4);
        switch (header) {
            case 'pong':
                this._handlePong();
                break;
            case 'EVL:':
                this._handleEval(data);
                break;
            case 'XML:':
                this._handleXML(data);
                break;
            default:
                this.dispatchEvent({
                    type: 'error',
                    message: `Unknown response header: ${header}`
                });
                break;
        }

    }

    private _onOpen (e: Event): void {

        this._connected = true;
        this._resetHeartbeat();
        this.dispatchEvent({ type: 'connect' });

    }

    private _ping () {

        if (this._ws) {
            this._heartbeat_timestamp = performance.now();
            this._ws.send('ping');
        }

    }

    private _reconnect (): void {

        window.setTimeout(this._initializeConnection.bind(this), this._auto_reconnect_interval);

    }

    private _request (request: string): boolean {

        return this._connected && this._ws
            ? (this._ws.send(request), true)
            : false;

    }

    private _resetHeartbeat (): void {

        clearTimeout(this._heartbeat_id);
        this._heartbeat_id = window.setTimeout(this._ping.bind(this), this._heartbeat_interval);

    }

}

export {
    SterlingConnection
};
