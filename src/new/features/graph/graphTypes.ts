import { ITreeNode } from '@blueprintjs/core';
import { AlloyInstance, AlloySignature } from 'alloy-ts';
import { Map } from 'immutable'

export type Tree = { id: string, children: Tree[] }

function buildSignatureIDTree (instance: AlloyInstance): Tree | null {

    const univ = instance.signatures().find(sig => sig.id() === 'univ');

    if (!univ) return null;

    const populate = (sig: AlloySignature): Tree => {

        const children = sig.subTypes().map(populate);
        return {
            id: sig.id(),
            children
        };

    };

    return populate(univ);

}

function mapTreeToNodes (tree: Tree | null, collapsed: Map<string, boolean>, selected: string | null): ITreeNode {

    if (tree === null) return {
        id: 'error',
        label: 'No Instance',
        icon: 'error'
    };

    const populate = (t: Tree): ITreeNode => {
        const childNodes = t.children.map(populate);
        return {
            id: t.id,
            label: t.id,
            icon: 'group-objects',
            isExpanded: !collapsed.get(t.id),
            isSelected: t.id === selected,
            hasCaret: !!childNodes.length,
            childNodes
        }
    };

    return populate(tree);

}

export {
    buildSignatureIDTree,
    mapTreeToNodes
}
