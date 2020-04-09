import { AlloyAtom } from './AlloyAtom';
import { AlloyProxy } from './AlloyProxy';
import { AlloySet, AlloyTuple } from './AlloySet';

class AlloySignature extends AlloySet {

    private readonly _id: string;
    private readonly _atoms: AlloyAtom[];

    private _subsignatures: AlloySignature[];

    constructor (id: string, atoms: AlloyAtom[], proxy?: AlloyProxy) {

        super();

        this._id = id;
        this._atoms = atoms;
        this._subsignatures = [];
        this._tuples = atoms.map(atom => new AlloyTuple([atom]));

        return proxy
            ? proxy.applyProxy(this, varName(id))
            : this;

    }

    atom (id: string): AlloyAtom | null {

        return this.atoms(true).find(atom => atom.id() === id) || null;

    }

    atoms (recursive?: boolean): AlloyAtom[] {

        return recursive
            ? this.atoms()
                .concat(this.subSignatures()
                    .map(subsig => subsig.atoms(true))
                    .reduce((acc, cur) => acc.concat(cur), []))
            : this._atoms.slice();

    }

    clone (proxy?: AlloyProxy): AlloySignature {

        const clone = new AlloySignature(
            this.id(),
            this.atoms().map(atom => atom.clone(proxy)),
            proxy
        );

        clone.subSignatures(this.subSignatures().map(sig => sig.clone(proxy)));

        return clone;

    }

    id (): string {

        return this._id;

    }

    subSignatures (recursive?: boolean): AlloySignature[];
    subSignatures (signatures: AlloySignature[]): this;
    subSignatures (signatures?: boolean | AlloySignature[]): AlloySignature[] | this {

        if (Array.isArray(signatures)) {
            this._subsignatures = signatures.slice();
            return this;
        }

        return signatures
            ? this.subSignatures()
                .concat(this.subSignatures()
                    .map(subsig => subsig.subSignatures(true))
                    .reduce((acc, cur) => acc.concat(cur), []))
            : this._subsignatures.slice();

    }

}

function varName (id: string): string {
    return id
        .replace(/^this\//, '')
        .replace('/', '$');
}

export {
    AlloySignature
}
