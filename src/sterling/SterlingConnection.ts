abstract class SterlingConnection {

    /**
     * Establish a connection with a data provider
     */
    abstract connect (): void;

    /**
     * Subscribe to a named event. When the event occurs, the provided callback
     * will be called and any data associated with the event will be passed as
     * an argument to the callback.
     * @param event The event to subscribe to
     * @param callback The callback to call when the event occurs
     */
    abstract on (event: string, callback: (...args: any[]) => void): SterlingConnection;

    /**
     * Submit a request to the data provider.
     * @param request The request to be submitted to the data provider.
     */
    abstract request (request: string): void;

}

export {
    SterlingConnection
};
