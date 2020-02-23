import { AlloyField, AlloySkolem } from 'alloy-ts';
import { FieldTag } from '../../../table/TableTags';
import { Tree } from '../../graphTypes';

function buildFieldTree (fields: AlloyField[], hideEmpty: boolean): Tree | null {

    const flds = hideEmpty
        ? fields.filter(field => field.tuples().length)
        : fields;

    return {
        id: 'Fields',
        children: flds.map(field => {
            return {
                id: field.id(),
                label: FieldTag.FieldTagEls(field.id().split('<:')),
                icon: 'flows',
                children: []
            }
        })
    };

}

function buildSkolemTree (skolems: AlloySkolem[]): Tree | null {

    return {
        id: 'Skolems',
        children: skolems
            .map(skolem => {
                return {
                    id: skolem.id(),
                    icon: 'flows',
                    children: []
                }
            })
    };

}

export {
    buildFieldTree,
    buildSkolemTree
}
