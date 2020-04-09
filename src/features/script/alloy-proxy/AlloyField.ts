import { isDefined } from 'ts-is-present';
import { AlloyError } from './AlloyError';
import { AlloyProxy } from './AlloyProxy';
import { AlloySignature } from './AlloySignature';
import { AlloyTuple } from './AlloySet';
import { AlloyTypedSet } from './AlloyTypedSet';

class AlloyField extends AlloyTypedSet {

    private readonly _id: string;

    constructor (id: string, types: AlloySignature[], tuples: AlloyTuple[], proxy?: AlloyProxy, varName?: string) {

        super(types, tuples);
        this._id = id;

        return proxy
            ? proxy.applyProxy(this, varName ? varName : id)
            : this;

    }

    clone (signatures: AlloySignature[], proxy?: AlloyProxy): AlloyField {

        const types = this.types().map(type => signatures.find(sig => sig.id() === type.id()));
        if (!types.every(isDefined))
            throw AlloyError.error('AlloyField', 'Missing type, cannot clone field');

        const tuples = this.tuples().map(tuple => {
            return new AlloyTuple(tuple.atoms().map((atom, index) => {
                const clonedAtom = types[index]!.atom(atom.id());
                if (!clonedAtom) throw AlloyError.error('AlloyField', 'Missing atom, cannot clone field');
                return clonedAtom;
            }));
        });

        if (proxy) {

            const varName = Reflect.get(this, '__var__');
            if (!varName) throw AlloyError.error('AlloyField', 'Cannot use proxy to clone non-proxied field');
            return new AlloyField(this.id(), types as AlloySignature[], tuples, proxy, varName);

        }

        return new AlloyField(this.id(), types as AlloySignature[], tuples);

    }

    id (): string {

        return this._id;

    }

}

export {
    AlloyField
}
