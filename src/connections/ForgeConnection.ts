import { SterlingConnection } from '../sterling/SterlingConnection';

class ForgeConnection extends SterlingConnection {

    constructor () {

        super('ws://localhost:' + window.location.search.slice(1));

    }

}

export {
    ForgeConnection
}