import { isDefined } from 'ts-is-present';
import { AlloyError } from './AlloyError';
import { AlloyProxy } from './AlloyProxy';
import { AlloySignature } from './AlloySignature';
import { AlloyTuple } from './AlloySet';
import { AlloyTypedSet } from './AlloyTypedSet';

class AlloySkolem extends AlloyTypedSet {

    private readonly _id: string;

    constructor (id: string, types: AlloySignature[], tuples: AlloyTuple[], proxy?: AlloyProxy) {

        super(types, tuples);
        this._id = id;

        return proxy
            ? proxy.applyProxy(this, varName(id))
            : this;

    }

    clone (signatures: AlloySignature[], proxy?: AlloyProxy): AlloySkolem {

        const types = this.types().map(type => signatures.find(sig => sig.id() === type.id()));
        if (!types.every(isDefined))
            throw AlloyError.error('AlloySkolem', 'Missing type, cannot clone field');

        const tuples = this.tuples().map(tuple => {
            return new AlloyTuple(tuple.atoms().map((atom, index) => {
                const clonedAtom = types[index]!.atom(atom.id());
                if (!clonedAtom) throw AlloyError.error('AlloySkolem', 'Missing atom, cannot clone field');
                return clonedAtom;
            }));
        });

        return new AlloySkolem(this.id(), types as AlloySignature[], tuples, proxy);

    }

    id (): string {

        return this._id;

    }

}

function varName (id: string): string {
    return id
        .replace(/^this\//, '')
        .replace('/', '$');
}

export {
    AlloySkolem
}
