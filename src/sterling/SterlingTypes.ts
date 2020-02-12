import {
    AlloyElement,
    AlloyField,
    AlloySignature,
    AlloySkolem
} from 'alloy-ts';
import React from 'react';
import { IconName } from '@blueprintjs/core';
import { SterlingConnection } from './SterlingConnection';

export interface ISterlingUIView {
    name: string,
    icon: IconName,
    view: React.ComponentType<ISterlingViewProps>,
    transform?: (data: any) => any
}

export interface ISterlingViewProps {
    connection: SterlingConnection,
    data: any,
    visible: boolean
}


/**
 * General
 */
export enum HorizontalAlignment { Left, Center, Right}
export enum LayoutDirection { Row, Column}
export enum SortDirection { Ascending, Descending}

/**
 * Alloy
 */
export type AlloyNameFn = (item: AlloyElement) => string;
export type AlloySortFn = (a: AlloyElement, b: AlloyElement) => number;
export type SigFieldSkolem = AlloySignature | AlloyField | AlloySkolem;

/**
 * Tables
 */
export type TableSortFunction = (a: SigFieldSkolem, b: SigFieldSkolem) => number;
export enum TablesType { All, Signatures, Fields, Skolems, Select}
