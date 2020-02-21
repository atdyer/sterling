import { ITreeNode } from '@blueprintjs/core';
import { Map } from 'immutable'

export type Tree = { id: string, children: Tree[] }

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
    mapTreeToNodes
}
