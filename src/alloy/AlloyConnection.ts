import { SterlingConnection } from '../sterling/SterlingConnection';

class AlloyConnection extends SterlingConnection {

    constructor () {

        super('ws://' + window.location.hostname + ':' + window.location.port + '/alloy');

    }

}

export {
    AlloyConnection
};
