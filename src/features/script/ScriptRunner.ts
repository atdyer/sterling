import { require } from 'd3-require';
import { showErrorToast } from './components/ScriptToaster';

class ScriptRunner {

    private _args: string[];
    private _libs: string[];
    private readonly _libraries: Map<string, any>;
    private _script: string;

    constructor () {

        this._args = [];
        this._libs = [];
        this._libraries = new Map();
        this._script = '';

    }

    args (...args: string[]): this {

        this._args = args;
        return this;

    }

    libraries (libraries: string[]): this {

        this._libs = libraries;
        return this;

    }

    run (...args: any[]): Promise<any> {

        // eslint-disable-next-line no-new-func
        const fn = new Function(
            ...this._args,
            ...this._libs.map(packageName),
            this._script
        );

        return Promise
            .all(this._libs.map(this._fetchLibrary.bind(this)))
            .then(libs => {
                fn(...args, ...libs);
            });

    }

    script (script: string): this {

        this._script = script;
        return this;

    }

    private _fetchLibrary (library: string): Promise<any> {

        const pkg = packageName(library);

        return this._libraries.has(pkg)
            ? Promise.resolve(this._libraries.get(pkg))
            : require(library)
                .then(lib => {
                    this._libraries.set(pkg, lib);
                    return lib;
                }).catch(error => {
                    showErrorToast(`${library}: ${error.message}`)
                });

    }

}

function packageName (library: string): string {
    return library.split('@')[0];
}

export {
    packageName,
    ScriptRunner
}
