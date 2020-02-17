import {
    AlloyElement,
    AlloyField,
    AlloySignature,
    AlloySkolem, sorting
} from 'alloy-ts';

export enum HorizontalAlignment { Left, Center, Right}
export enum LayoutDirection { Row, Column}
export enum SortDirection { Ascending, Descending}
export enum SortMethod { Alphabetical, Builtin, Group, Size}
export enum TablesType { All, Signatures, Fields, Skolems, Select}

export type AlloyNameFn = (item: AlloyElement) => string;
export type AlloySortFn = (a: AlloyElement, b: AlloyElement) => number;
export type SigFieldSkolem = AlloySignature | AlloyField | AlloySkolem;
export type SortType = {
    method: SortMethod
    direction: SortDirection
};

export const SKOLEM_COLORS = [
    "#2965CC", "#29A634", "#D99E0B", "#D13913", "#8F398F",
    "#00B3A4", "#DB2C6F", "#9BBF30", "#96622D", "#7157D9"
];

function buildNameFunction (removeThis: boolean): AlloyNameFn {
    return (item: AlloyElement) => {
        return removeThis
            ? item.id().replace(/^this\//, '')
            : item.id();
    }
}

function buildSortFunction (type: SortType, nameFunction: AlloyNameFn): AlloySortFn {
    if (type.method === SortMethod.Size) {
        return sorting.sizeSort(type.direction === SortDirection.Ascending);
    }
    if (type.method === SortMethod.Alphabetical) {
        return sorting.alphabeticalSort(nameFunction, type.direction === SortDirection.Ascending);
    }
    if (type.method === SortMethod.Group) {
        return sorting.groupSort();
    }
    return () => 0;
}

function getAlignClass (alignment: HorizontalAlignment): string {
    return alignment === HorizontalAlignment.Left ? 'left' :
        alignment === HorizontalAlignment.Center ? 'center' :
            alignment === HorizontalAlignment.Right ? 'right' : '';
}

function getLayoutClass (direction: LayoutDirection): string {
    return direction === LayoutDirection.Row ? 'row' :
        direction === LayoutDirection.Column ? 'column' : '';
}

export {
    getAlignClass,
    buildNameFunction,
    buildSortFunction,
    getLayoutClass
}
