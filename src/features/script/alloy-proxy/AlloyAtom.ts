import { AlloyProxy } from './AlloyProxy';
import { AlloySet, AlloyTuple } from './AlloySet';

class AlloyAtom extends AlloySet {

    private readonly _id: string;

    constructor (id: string, proxy?: AlloyProxy) {

        super();

        const self = proxy
            ? proxy.applyProxy(this, varName(id))
            : this;

        this._id = id;
        this._tuples = [new AlloyTuple([self])];

        return self;

    }

    clone (proxy?: AlloyProxy): AlloyAtom {

        return new AlloyAtom(this.id(), proxy);

    }

    id (): string {

        return this._id;

    }

}

function varName (id: string): string {
    return id
        .replace('/', '$');
}

export {
    AlloyAtom
}
