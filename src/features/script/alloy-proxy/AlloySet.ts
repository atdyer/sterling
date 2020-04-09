import { AlloyAtom } from './AlloyAtom';

class AlloySet {

    protected _tuples: AlloyTuple[];

    constructor (tuples?: AlloyTuple[]) {

        this._tuples = tuples || [];

    }

    empty (): boolean {

        return this._tuples.length === 0;

    }

    equals (that: AlloySet): boolean {

        return this.toString() === that.toString();

    }

    in (that: AlloySet): boolean {

        const thatSet = new Set(that.tuples().map(tuple => tuple.toString()));
        return this.tuples().every(tuple => thatSet.has(tuple.toString()));

    }

    join (that: AlloySet): AlloySet {

        if (!this.tuples().length || !that.tuples().length)
            return new AlloySet();

        const tupleMap = mapColumnToTuples(0, that.tuples());
        const joinTups: AlloyTuple[] = [];
        const i = this._tuples[0].atoms().length - 1;

        this.tuples().forEach(tuple => {
            const atom = tuple.atoms()[i];
            const tups = tupleMap.get(atom);
            if (tups) tups.forEach(tup => {
                const atoms = tuple.atoms()
                    .slice(0, -1)
                    .concat(...tup.atoms().slice(1));
                joinTups.push(new AlloyTuple(atoms));
            });
        });

        return new AlloySet(removeDuplicateTuples(joinTups));

    }

    toString (): string {

        return this._tuples.map(tuple => tuple.toString()).join('\n');

    }

    tuples (): AlloyTuple[] {

        return this._tuples.slice();

    }

}

class AlloyTuple extends AlloySet {

    private _atoms: AlloyAtom[];

    constructor (atoms: AlloyAtom[]) {

        super();
        this._tuples = [this];
        this._atoms = atoms;

    }

    atoms (): AlloyAtom[] {

        return this._atoms.slice();

    }

    toString (): string {

        return this._atoms.map(atom => atom.id()).join(', ');

    }

}

function mapColumnToTuples (column: number, tuples: AlloyTuple[]): Map<AlloyAtom, AlloyTuple[]> {

    const rTups = new Map<AlloyAtom, AlloyTuple[]>();
    tuples.forEach(tuple => {
        const atom = tuple.atoms()[column];
        if (!rTups.has(atom))
            rTups.set(atom, []);
        rTups.get(atom)!.push(tuple);
    });
    return rTups;

}

function removeDuplicateTuples (tuples: AlloyTuple[]): AlloyTuple[] {
    const set = new Set<string>();
    return tuples.filter(tuple => {
        const uid = tuple.atoms().map(atom => atom.id()).join();
        if (!set.has(uid)) {
            set.add(uid);
            return true;
        }
        return false;
    });
}

export {
    AlloySet,
    AlloyTuple
}
