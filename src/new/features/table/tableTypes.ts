import {
    AlloyElement,
    AlloyField,
    AlloySignature,
    AlloySkolem
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