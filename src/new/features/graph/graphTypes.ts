import { CircleStyle, Node, RectangleStyle } from '@atdyer/graph-js';
import { AlloyAtom, AlloySignature } from 'alloy-ts';

export type SignatureStyleMap = {[key: string]: (CircleStyle | RectangleStyle | null)};

function mergeAtomsToNodes (nodes: Node[], atoms: AlloyAtom[]): Node[] {

    return atoms.map(atom => {
        const id = atom.name();
        const existing = nodes.find(node => node.id === id);
        if (existing) {
            return existing;
        } else {
            return {
                id: id,
                x: 0,
                y: 0
            }
        }
    });

}

function mergeSignaturesToStyles (styles: SignatureStyleMap, signatures: AlloySignature[]) {

    // Make a set of ids
    const ids = new Set(signatures.map(sig => sig.id()));

    // Remove ones that no longer exist
    for (const sig in styles) {
        if (styles.hasOwnProperty(sig)) {
            if (!ids.has(sig)) delete styles[sig];
        }
    }

    // Add those that don't already exist
    signatures.forEach(sig => {
        if (!styles.hasOwnProperty(sig.id())) {
            styles[sig.id()] = null;
        }
    });

    // Set a default shape for univ
    if (styles.hasOwnProperty('univ') && styles.univ === null) {
        styles.univ = {
            type: 'circle'
        }
    }

}

export {
    mergeAtomsToNodes,
    mergeSignaturesToStyles
}
