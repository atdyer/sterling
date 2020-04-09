import { isDefined } from 'ts-is-present';
import { AlloyAtom } from './AlloyAtom';
import { AlloyError } from './AlloyError';
import { AlloyField } from './AlloyField';
import { AlloyProxy } from './AlloyProxy';
import { AlloySignature } from './AlloySignature';
import { AlloySkolem } from './AlloySkolem';
import { AlloyTuple } from './AlloySet';

class AlloyInstance {

    private readonly _proxy: AlloyProxy;

    private _atoms: AlloyAtom[];
    private _fields: AlloyField[];
    private _signatures: AlloySignature[];
    private _skolems: AlloySkolem[];

    private _bitwidth: number;
    private _command: string;
    private _filename: string;

    constructor (text: string);
    constructor (signatures: AlloySignature[],
                 fields: AlloyField[],
                 skolems: AlloySkolem[],
                 bitwidth: number,
                 command: string,
                 filename: string,
                 proxy?: AlloyProxy);
    constructor (textOrSigs: string | AlloySignature[],
                 fields?: AlloyField[],
                 skolems?: AlloySkolem[],
                 bitwidth?: number,
                 command?: string,
                 filename?: string,
                 proxy?: AlloyProxy) {

        this._proxy = proxy || new AlloyProxy();

        this._signatures = typeof textOrSigs === 'string' ? [] : textOrSigs;
        this._atoms = typeof textOrSigs === 'string'
            ? []
            : textOrSigs.map(sig => sig.atoms()).reduce((acc, cur) => acc.concat(cur), []);

        this._fields = fields || [];
        this._skolems = skolems || [];

        this._bitwidth = bitwidth || 0;
        this._command = command || '';
        this._filename = filename || '';

        if (typeof textOrSigs === 'string')
            this._buildFromXML(textOrSigs);

    }

    atom (id: string): AlloyAtom | null {

        return this._atoms.find(atom => atom.id() === id) || null;

    }

    atoms (): AlloyAtom[] {

        return this._atoms.slice();

    }

    bitwidth (): number {

        return this._bitwidth;

    }

    clone (): AlloyInstance {

        const proxy = new AlloyProxy();
        const univ = this.univ();

        if (!univ) throw AlloyError.error('AlloyInstance', 'Cannot clone an instance without univ signature');

        const univClone = univ.clone(proxy);

        const signatures = [univClone, ...univClone.subSignatures(true)];
        const fields = this.fields().map(field => field.clone(signatures, proxy));
        const skolems = this.skolems().map(skolem => skolem.clone(signatures, proxy));

        return new AlloyInstance(
            signatures,
            fields,
            skolems,
            this.bitwidth(),
            this.command(),
            this.filename(),
            proxy
        );

    }

    command (): string {

        return this._command;

    }

    field (id: string): AlloyField | null {

        return this._fields.find(field => field.id() === id) || null;

    }

    fields (): AlloyField[] {

        return this._fields;

    }

    filename (): string {

        return this._filename;

    }

    project (atoms: AlloyAtom[]): AlloyInstance {

        // Create clone and find same atoms
        const _instance = this.clone();
        const _atoms = atoms.map(atom => _instance.atom(atom.id()));
        if (!_atoms.every(isDefined))
            throw AlloyError.error('AlloyInstance', 'Error cloning instance');

        // Make sure there's one atom per top-level signature
        const univ = _instance.univ();
        if (!univ) throw AlloyError.error('AlloyInstance', 'No univ signature');

        const allowableSigs = univ.subSignatures();
        const sigAtoms = new Map<AlloySignature, AlloyAtom>();
        _atoms.forEach(atom => {
            allowableSigs.forEach(signature => {
                if (signature.atoms(true).includes(atom!)) {
                    if (sigAtoms.has(signature))
                        throw AlloyError.error('AlloyInstance', 'Cannot project over multiple atoms from the same signature');
                    sigAtoms.set(signature, atom!);
                }
            });
        });

        // Do projection
        _instance.fields().forEach(field => field.project(sigAtoms));
        _instance.skolems().forEach(skolem => skolem.project(sigAtoms));
        return _instance;

    }

    signature (id: string): AlloySignature | null {

        return this.signatures().find(sig => sig.id() === id) || null;

    }

    signatures (): AlloySignature[] {

        return this._signatures.slice();

    }

    skolems (): AlloySkolem[] {

        return this._skolems.slice();

    }

    univ (): AlloySignature | null {

        return this._signatures.find(sig => sig.id() === 'univ') || null;

    }

    private _buildFromXML (text: string): void {

        const parser = new DOMParser();
        const document = parser.parseFromString(text, 'application/xml');
        const instance = document.querySelector('instance');

        if (!instance)
            throw AlloyError.missingElement('AlloyInstance', 'instance');

        const bw = instance.getAttribute('bitwidth');
        const cd = instance.getAttribute('command');
        const fn = instance.getAttribute('filename');
        const ms = instance.getAttribute('maxseq');

        if (!bw) throw AlloyError.missingAttribute('AlloyInstance', 'bitwidth');
        if (!cd) throw AlloyError.missingAttribute('AlloyInstance', 'command');
        if (!fn) throw AlloyError.missingAttribute('AlloyInstance', 'filename');
        if (!ms) throw AlloyError.missingAttribute('AlloyInstance', 'maxseq');
        if (+bw < 1) throw AlloyError.error('AlloyInstance', `Invalid bitwidth ${bw}`);

        this._bitwidth = +bw;
        this._command = cd;
        this._filename = fn;

        this._atoms = [];
        this._fields = [];
        this._signatures = [];
        this._skolems = [];

        const sigIds = this._xmlBuildSigsAndAtoms(instance);
        this._xmlBuildFieldsAndSkolems(instance, sigIds);

    }

    private _xmlBuildSigsAndAtoms (instance: Element): Map<string, AlloySignature> {

        this._atoms = [];
        this._signatures = [];
        const signatures = Array.from(instance.querySelectorAll('sig'));
        const sigIds = new Map<string, AlloySignature>();
        const sigChildren = new Map<string, string[]>();

        // Build int signature
        const intAtoms: AlloyAtom[] = [];
        for (let n = 2 ** this._bitwidth, i = -n / 2; i < n / 2; ++i) {
            const atom = new AlloyAtom(i.toString(), this._proxy);
            this._atoms.push(atom);
            intAtoms.push(atom);
        }
        const intSig = new AlloySignature('Int', intAtoms, this._proxy);

        // Build all signatures and atoms except for int and seq/int
        this._signatures = signatures
            .filter(filterSeqInt)
            .map(sigEl => {

                const atoms = Array.from(sigEl.querySelectorAll('atom')).map(atomEl => {

                    const label = atomEl.getAttribute('label');
                    if (!label) throw AlloyError.missingAttribute('AlloyAtom', 'label');
                    const atom = new AlloyAtom(label, this._proxy);
                    this._atoms.push(atom);
                    return atom;

                });

                const id = sigEl.getAttribute('ID');
                const parent = sigEl.getAttribute('parentID');
                const label = sigEl.getAttribute('label');

                if (!id) throw AlloyError.missingAttribute('AlloySignature', 'ID');
                if (!label) throw AlloyError.missingAttribute('AlloySignature', 'label');
                if (!parent && label !== 'univ') AlloyError.missingAttribute('AlloySignature', 'parentID');

                const signature = label === 'Int'
                    ? intSig
                    : new AlloySignature(label, atoms, this._proxy);

                sigIds.set(id, signature);

                if (parent) {
                    if (!sigChildren.has(parent))
                        sigChildren.set(parent, []);
                    sigChildren.get(parent)!.push(id);
                }

                return signature;

            });

        // Build signature tree
        sigIds.forEach((signature, id) => {

            const childIDs = sigChildren.get(id) || [];
            const children = childIDs
                .map(id => sigIds.get(id))
                .filter(isDefined);

            signature.subSignatures(children);

        });

        return sigIds;

    }

    private _xmlBuildFieldsAndSkolems (instance: Element, sigIds: Map<string, AlloySignature>) {

        // Count number of each field name
        const fields = Array.from(instance.querySelectorAll('field'));
        const fieldVarCount = new Map<string, number>();
        fields.forEach(fldEl => {

            const label = fldEl.getAttribute('label');
            if (!label) throw AlloyError.missingAttribute('AlloyField', 'label');
            fieldVarCount.set(label, (fieldVarCount.get(label) || 0) + 1);

        });

        // Create a function that can be used to build a list of tuples
        const tuples = (elements: NodeListOf<Element>): AlloyTuple[] => {

            return Array.from(elements).map(tupEl => {

                const atoms = Array.from(tupEl.querySelectorAll('atom')).map(atomEl => {

                    const atomLabel = atomEl.getAttribute('label');
                    if (!atomLabel) throw AlloyError.missingAttribute('AlloyAtom', 'label');
                    const atom = this.atom(atomLabel);
                    if (!atom) throw AlloyError.error('AlloyInstance', `No atom: ${atomLabel}`);
                    return atom;

                });

                return new AlloyTuple(atoms);

            })

        };

        // Build fields
        this._fields = fields.map(fldEl => {

            const label = fldEl.getAttribute('label');
            const parentID = fldEl.getAttribute('parentID');
            const types = fldEl.querySelector('types');
            if (!label) throw AlloyError.missingAttribute('AlloyField', 'label');
            if (!parentID) throw AlloyError.missingAttribute('AlloyField', 'parentID');
            if (!types) throw AlloyError.missingElement('AlloyField', 'types');

            const count = fieldVarCount.get(label)!;
            const parent = sigIds.get(parentID);
            const typesigs = Array.from(types.querySelectorAll('type')).map(type => {
                const typeID = type.getAttribute('ID');
                if (!typeID) throw AlloyError.missingAttribute('AlloyField', 'ID');
                const sig = sigIds.get(typeID);
                if (!sig) throw AlloyError.error('AlloyField', `Signature doesn't exist: ${typeID}`);
                return sig;
            });

            if (parent === undefined)
                throw AlloyError.error('AlloyField', 'Field parent type does not exist');

            const varName = count > 1
                ? multiFieldName(label, parent)
                : label;

            return new AlloyField(
                label,
                typesigs,
                tuples(fldEl.querySelectorAll('tuple')),
                this._proxy,
                varName
            );

        });

        // Build skolems
        const skolems = Array.from(instance.querySelectorAll('skolem'));
        this._skolems = skolems.map(skolEl => {

            const label = skolEl.getAttribute('label');
            const types = skolEl.querySelector('types');
            if (!label) throw AlloyError.missingAttribute('AlloySkolem', 'label');
            if (!types) throw AlloyError.missingElement('AlloySkolem', 'types');

            const typesigs = Array.from(types.querySelectorAll('type')).map(type => {
                const typeID = type.getAttribute('ID');
                if (!typeID) throw AlloyError.missingAttribute('AlloySkolem', 'ID');
                const sig = sigIds.get(typeID);
                if (!sig) throw AlloyError.error('AlloySkolem', `Signature does not exist: ${typeID}`);
                return sig;
            });

            return new AlloySkolem(
                label,
                typesigs,
                tuples(skolEl.querySelectorAll('tuple')),
                this._proxy
            );

        });

    }

}

function filterSeqInt (element: Element): boolean {
    const label = element.getAttribute('label');
    return !!label && label !== 'seq/Int';
}

function multiFieldName (field: string, signature: AlloySignature): string {
    return `${Reflect.get(signature, '__var__')}$${field}`;
}

export {
    AlloyInstance
}
