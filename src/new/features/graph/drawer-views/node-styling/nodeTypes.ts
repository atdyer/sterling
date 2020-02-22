import { AlloySignature } from 'alloy-ts';
import { Tree } from '../../graphTypes';

function buildTypeTree (univ?: AlloySignature): Tree | null {

    if (!univ) return null;

    const populate = (sig: AlloySignature): Tree => {

        const children = sig.subTypes().map(populate);
        return {
            id: sig.id(),
            icon: 'group-objects',
            children
        };

    };

    return populate(univ);

}

export {
    buildTypeTree
}
