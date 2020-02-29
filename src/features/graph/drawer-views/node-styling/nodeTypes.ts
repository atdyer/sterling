import { AlloySignature } from 'alloy-ts';
import { Tree } from '../../graphTypes';

function buildTypeTree (univ: AlloySignature | null, hideEmpty: boolean): Tree | null {

    if (!univ) return null;

    const populate = (sig: AlloySignature): Tree => {

        const subs = hideEmpty
            ? sig.subTypes().filter(s => s.atoms().length || s.subTypes().length)
            : sig.subTypes();

        const children = subs.map(populate);
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
