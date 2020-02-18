import { CircleStyle, RectangleStyle, ShapeStyle } from '@atdyer/graph-js';
import {
    isCircleStyle,
    isRectangleStyle
} from '@atdyer/graph-js/dist/styles/ShapeStyle';
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

function cloneShape (shape: ShapeStyle): ShapeStyle {

    if (isCircleStyle(shape)) {
        return {
            type: 'circle',
            radius: shape.radius,
            fill: shape.fill,
            stroke: shape.stroke,
            strokeDash: shape.strokeDash,
            strokeWidth: shape.strokeWidth
        } as CircleStyle
    }

    if (isRectangleStyle(shape)) {
        return {
            type: 'rectangle',
            width: shape.width,
            height: shape.height,
            fill: shape.fill,
            stroke: shape.stroke,
            strokeDash: shape.strokeDash,
            strokeWidth: shape.strokeWidth
        } as RectangleStyle
    }

    return {};
}

function convertShape (current: ShapeStyle, next: string | null): ShapeStyle {

    const fill = current ? current.fill : 'white';
    const stroke = current ? current.stroke : '#333333';
    const strokeDash = current ? current.strokeDash : [];
    const strokeWidth = current ? current.strokeWidth : 1.5;

    if (next === 'circle') {
        const radius = current && isRectangleStyle(current)
            ? Math.min(current.width || 35, current.height || 35)
            : 35;
        return {
            type: 'circle',
            fill,
            radius,
            stroke,
            strokeDash,
            strokeWidth
        } as CircleStyle
    }

    if (next === 'rectangle') {
        const width = current && isCircleStyle(current)
            ? (current.radius || 40) * 2
            : 80;
        const height = current && isCircleStyle(current)
            ? current.radius
            : 40;
        return {
            type: 'rectangle',
            fill,
            height,
            stroke,
            strokeDash,
            strokeWidth,
            width
        } as RectangleStyle
    }

    return {};

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
            icon: 'id-number',
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
    cloneShape,
    convertShape,
    mapTreeToNodes
}
