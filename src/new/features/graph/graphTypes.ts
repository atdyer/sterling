import { CircleStyle, Node, RectangleStyle } from '@atdyer/graph-js';
import { AlloyAtom, AlloySignature } from 'alloy-ts';

export type SignatureStyle = CircleStyle | RectangleStyle | null;
export type SignatureStyleMap = {[key: string]: SignatureStyle};

function convertStyle (current: SignatureStyle, next: string | null): SignatureStyle {

    const fill = current ? current.fill : 'white';
    const stroke = current ? current.stroke : 'black';
    const strokeDash = current ? current.strokeDash : [];
    const strokeWidth = current ? current.strokeWidth : 1;

    if (next === 'circle') {
        const radius = current && current.type === 'rectangle'
            ? Math.min(current.width || 35, current.height || 35)
            : 35;
        return {
            type: 'circle',
            fill,
            radius,
            stroke,
            strokeDash,
            strokeWidth
        }
    }

    if (next === 'rectangle') {
        const width = current && current.type === 'circle'
            ? (current.radius || 35) * 2
            : 70;
        const height = current && current.type === 'circle'
            ? current.radius
            : 35;
        return {
            type: 'rectangle',
            fill,
            height,
            stroke,
            strokeDash,
            strokeWidth,
            width

        }
    }

    return null;

}

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
            type: 'circle',
            radius: 35,
            stroke: 'black',
            strokeDash: [],
            strokeWidth: 1
        }
    }

}

export {
    convertStyle,
    mergeAtomsToNodes,
    mergeSignaturesToStyles
}
