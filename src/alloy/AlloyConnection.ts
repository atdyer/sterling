import { AlloyInstance } from 'alloy-ts';
import { SterlingConnection } from '../sterling/SterlingConnection';

class AlloyConnection extends SterlingConnection {

    _ws: WebSocket | null;
    _cb: Map<string, ((...args: any[]) => void)[]>;
    _rq: Map<string, () => void>;

    _heartbeat_count: number;
    _heartbeat_id: number;
    _heartbeat_interval: number;
    _heartbeat_latency: DOMHighResTimeStamp;
    _heartbeat_timestamp: DOMHighResTimeStamp;

    _auto_reconnect: boolean;
    _auto_reconnect_interval: number;

    constructor () {

        super();

        this._ws = null;
        this._cb = new Map();
        this._rq = new Map();

        this._heartbeat_count = 0;
        this._heartbeat_id = 0;
        this._heartbeat_interval = 15000;
        this._heartbeat_latency = 0;
        this._heartbeat_timestamp = 0;

        this._auto_reconnect = false;
        this._auto_reconnect_interval = 5000;

        this._rq.set('current', () => this._request('current'));
        this._rq.set('next', () => this._request('next'));

    }

    average_latency (): number {

        if (this._heartbeat_count > 0) {
            return this._heartbeat_latency / this._heartbeat_count;
        }
        return 0;

    }

    connect () {

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

    request (request: string): void {

        if (this._rq.has(request))
            this._rq.get(request)!();

    }

    _on_open (e: Event) {

        this._reset_heartbeat();
        if (this._cb.has('connect')) {
            this._cb.get('connect')!.forEach(cb => cb());
        }

    }

    _on_close (e: Event) {

        this._ws = null;
        if (this._auto_reconnect) this._reconnect();
        if (this._cb.has('disconnect')) {
            this._cb.get('disconnect')!.forEach(cb => cb());
        }

    }

    _on_error (e: Event) {

        if (this._auto_reconnect) this._reconnect();
        if (this._cb.has('error')) {
            this._cb.get('error')!.forEach(cb => cb(e));
        }

    }

    _on_message (e: MessageEvent) {

        this._reset_heartbeat();
        let header = e.data.slice(0, 4);
        let data = e.data.slice(4);

        switch (header) {

            case 'pong':
                this._heartbeat_latency += performance.now() - this._heartbeat_timestamp;
                this._heartbeat_count += 1;
                break;

            case 'XML:':
                if (data.length && this._cb.has('instance')) {
                    let instance = new AlloyInstance(data);
                    this._cb.get('instance')!.forEach(cb => cb(instance));
                }
                break;

            default:
                break;

        }

    }

    _reconnect () {

        window.setTimeout(this.connect.bind(this), this._auto_reconnect_interval);

    }

    _request (request: string): void {

        if (this._ws)
            this._ws.send(request);

    }

    _reset_heartbeat () {

        clearTimeout(this._heartbeat_id);
        this._heartbeat_id = window.setTimeout(this._ping.bind(this), this._heartbeat_interval);

    }

    _ping () {

        if (this._ws) {
            this._heartbeat_timestamp = performance.now();
            this._ws.send('ping');
        }

    }

}

export {
    AlloyConnection
};
