import { AlloyInstance } from 'alloy-ts';
import { SterlingConnection } from '../sterling/SterlingConnection';

class AlloyConnection extends SterlingConnection {

    _ws: WebSocket | null;
    _cb: Map<string, ((...args: any[]) => void)[]>;

    _heartbeat_count: number;
    _heartbeat_id: number;
    _heartbeat_interval: number;
    _heartbeat_latency: DOMHighResTimeStamp;
    _heartbeat_timestamp: DOMHighResTimeStamp;

    _auto_reconnect: boolean;
    _auto_reconnect_interval: number;
    _connected: boolean;

    constructor () {

        super();

        this._ws = null;
        this._cb = new Map();

        this._heartbeat_count = 0;
        this._heartbeat_id = 0;
        this._heartbeat_interval = 15000;
        this._heartbeat_latency = 0;
        this._heartbeat_timestamp = 0;

        this._auto_reconnect = false;
        this._auto_reconnect_interval = 5000;
        this._connected = false;

    }

    average_latency (): number {

        if (this._heartbeat_count > 0) {
            return this._heartbeat_latency / this._heartbeat_count;
        }
        return 0;

    }

    connect (): void {

        if (this._ws) {
            this._ws.onclose = null;
            this._ws.close();
        }

        try {

            this._ws = new WebSocket('ws://' + window.location.hostname + ':' + window.location.port + '/alloy');
            this._ws.onopen = this._on_open.bind(this);
            this._ws.onclose = this._on_close.bind(this);
            this._ws.onerror = this._on_error.bind(this);
            this._ws.onmessage = this._on_message.bind(this);

        } catch (e) {

            if (this._cb.has('error'))
                this._cb.get('error')!.forEach(e);

        }

    }

    on (event: string, callback: (...args: any[]) => void): AlloyConnection {

        if (!this._cb.has(event)) {
            this._cb.set(event, []);
        }

        this._cb.get(event)!.push(callback);

        return this;

    }

    request (request: string): boolean {

        return this._request(request);

    }

    private _handle_eval (data: string): void {
        const cbs = this._cb.get('eval') || [];
        if (data.length) {
            cbs.forEach(cb => cb(data));
        }
    }

    private _handle_instance (data: string): void {

        const cbs = this._cb.get('instance') || [];
        if (data.length) {
            let instance = new AlloyInstance(data);
            cbs.forEach(cb => cb(instance));
        }

    }

    private _handle_pong (): void {

        this._heartbeat_latency += performance.now() - this._heartbeat_timestamp;
        this._heartbeat_count += 1;

    }

    private _on_open (e: Event) {

        this._connected = true;
        this._reset_heartbeat();
        if (this._cb.has('connect')) {
            this._cb.get('connect')!.forEach(cb => cb());
        }

    }

    private _on_close (e: Event) {

        this._connected = false;
        this._ws = null;
        if (this._auto_reconnect) this._reconnect();
        if (this._cb.has('disconnect')) {
            this._cb.get('disconnect')!.forEach(cb => cb());
        }

    }

    private _on_error (e: Event) {

        if (this._auto_reconnect) this._reconnect();
        if (this._cb.has('error')) {
            this._cb.get('error')!.forEach(cb => cb(e));
        }

    }

    private _on_message (e: MessageEvent) {

        this._reset_heartbeat();
        let header = e.data.slice(0, 4);
        let data = e.data.slice(4);

        switch (header) {

            case 'pong':
                this._handle_pong();
                break;

            case 'EVL:':
                this._handle_eval(data);
                break;

            case 'XML:':
                this._handle_instance(data);
                break;

            default:
                break;

        }

    }

    private _reconnect () {

        window.setTimeout(this.connect.bind(this), this._auto_reconnect_interval);

    }

    private _request (request: string): boolean {

        if (this._connected && this._ws)
            this._ws.send(request);
        return this._connected && !!this._ws;

    }

    private _reset_heartbeat () {

        clearTimeout(this._heartbeat_id);
        this._heartbeat_id = window.setTimeout(this._ping.bind(this), this._heartbeat_interval);

    }

    private _ping () {

        if (this._ws) {
            this._heartbeat_timestamp = performance.now();
            this._ws.send('ping');
        }

    }

}

export {
    AlloyConnection
};
