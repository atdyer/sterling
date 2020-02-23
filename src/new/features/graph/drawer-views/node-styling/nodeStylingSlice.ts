import {
    CircleStyle,
    cloneLabelStyle,
    cloneShapeStyle,
    convertToShape,
    LabelStyle,
    RectangleStyle,
    ShapeStyle
} from '@atdyer/graph-js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloyInstance, AlloySignature } from 'alloy-ts';
import { Map } from 'immutable';
import { setInstance } from '../../../../alloy/alloySlice';
import { Tree } from '../../graphTypes';
import { buildTypeTree } from './nodeTypes';

export interface NodeStylingState {
    collapsed: Map<string, boolean>
    collapseNodeStyle: boolean
    hideDisconnected: Map<string, boolean>
    hideEmptySets: boolean
    labels: Map<string, LabelStyle>
    nodeTree: Tree | null
    selected: string | null
    shapes: Map<string, ShapeStyle>
    univ: AlloySignature | null
}

const initialState: NodeStylingState = {
    collapsed: Map(),
    collapseNodeStyle: false,
    hideDisconnected: Map(),
    hideEmptySets: true,
    labels: Map(),
    nodeTree: null,
    selected: null,
    shapes: Map(),
    univ: null
};

const nodeStylingSlice = createSlice({
    name: 'nodestyles',
    initialState: initialState,
    reducers: {
        clearAll (state) {
            state.labels = state.labels.map(() => ({}));
            state.shapes = state.shapes.map(() => ({}));
        },
        clearCurrent (state) {
            if (state.selected) {
                state.labels = state.labels.set(state.selected, {});
                state.shapes = state.shapes.set(state.selected, {});
            }
        },
        collapseTreeNode (state, action: PayloadAction<string>) {
            const target = action.payload;
            state.collapsed = state.collapsed.set(target, true);
        },
        expandTreeNode (state, action: PayloadAction<string>) {
            const target = action.payload;
            state.collapsed = state.collapsed.set(target, false);
        },
        selectTreeNode (state, action: PayloadAction<string>) {
            const target = action.payload;
            if (state.shapes.has(target)) state.selected = target;
        },
        setFill (state, action: PayloadAction<string|null>) {
            if (state.selected) {
                const shape = state.shapes.get(state.selected);
                if (shape) {
                    const color = action.payload;
                    const newshape = shape ? cloneShapeStyle(shape) : {};
                    color === null
                        ? delete newshape.fill
                        : newshape.fill = color;
                    state.shapes = state.shapes.set(state.selected, newshape);
                }
            }
        },
        setHeight (state, action: PayloadAction<string>) {
            if (state.selected) {
                const shape = state.shapes.get(state.selected);
                if (shape && shape.type === 'rectangle') {
                    const height = parseInt(action.payload);
                    const newshape = cloneShapeStyle(shape) as RectangleStyle;
                    isNaN(height) || height === 0
                        ? delete newshape.height
                        : newshape.height = height;
                    state.shapes = state.shapes.set(state.selected, newshape);
                }
            }
        },
        setLabelColor (state, action: PayloadAction<string|null>) {
            if (state.selected) {
                const label = state.labels.get(state.selected);
                if (label) {
                    const color = action.payload;
                    const newlabel = label ? cloneLabelStyle(label) : {};
                    color === null
                        ? delete newlabel.color
                        : newlabel.color = color;
                    state.labels = state.labels.set(state.selected, newlabel);
                }
            }
        },
        setLabelSize (state, action: PayloadAction<string>) {
            if (state.selected) {
                const label = state.labels.get(state.selected);
                if (label) {
                    const newlabel = label ? cloneLabelStyle(label) : {};
                    const size = parseInt(action.payload);
                    isNaN(size) || size === 0
                        ? delete newlabel.font
                        : newlabel.font = `${size}px sans-serif`;
                    state.labels = state.labels.set(state.selected, newlabel);
                }
            }
        },
        setRadius (state, action: PayloadAction<string>) {
            if (state.selected) {
                const shape = state.shapes.get(state.selected);
                if (shape && shape.type === 'circle') {
                    const radius = parseInt(action.payload);
                    const newshape = cloneShapeStyle(shape) as CircleStyle;
                    isNaN(radius) || radius === 0
                        ? delete newshape.radius
                        : newshape.radius = radius;
                    state.shapes = state.shapes.set(state.selected, newshape);
                }
            }
        },
        setShape (state, action: PayloadAction<'circle' | 'rectangle' | null>) {
            if (state.selected) {
                const shape = state.shapes.get(state.selected);
                const type = action.payload;
                if (shape === undefined) return;
                if ((shape && shape.type !== type) || shape !== type) {
                    const newshape = convertToShape(shape, type);
                    state.shapes = state.shapes.set(
                        state.selected,
                        newshape
                    );
                }
            }
        },
        setStroke (state, action: PayloadAction<string|null>) {
            if (state.selected) {
                const shape = state.shapes.get(state.selected);
                if (shape) {
                    const color = action.payload;
                    const newshape = cloneShapeStyle(shape)!;
                    color === null
                        ? delete newshape.stroke
                        : newshape.stroke = color;
                    state.shapes = state.shapes.set(state.selected, newshape);
                }
            }
        },
        setStrokeWidth (state, action: PayloadAction<string>) {
            if (state.selected) {
                const shape = state.shapes.get(state.selected);
                if (shape) {
                    const width = parseInt(action.payload);
                    const newshape = cloneShapeStyle(shape)!;
                    isNaN(width) || width === -1
                        ? delete newshape.strokeWidth
                        : newshape.strokeWidth = width;
                    state.shapes = state.shapes.set(state.selected, newshape);
                }
            }
        },
        setWidth (state, action: PayloadAction<string>) {
            if (state.selected) {
                const shape = state.shapes.get(state.selected);
                if (shape && shape.type === 'rectangle') {
                    const width = parseInt(action.payload);
                    const newshape = cloneShapeStyle(shape) as RectangleStyle;
                    isNaN(width) || width === 0
                        ? delete newshape.width
                        : newshape.width = width;
                    state.shapes = state.shapes.set(state.selected, newshape);
                }
            }
        },
        toggleCollapseNodeStyle (state) {
            state.collapseNodeStyle = !state.collapseNodeStyle;
        },
        toggleHideDisconnected (state) {
            const selected = state.selected;
            if (selected) {
                const next = !state.hideDisconnected.get(selected);
                state.hideDisconnected = state.hideDisconnected.set(selected, next);
            }
        },
        toggleHideEmptySets (state) {
            state.hideEmptySets = !state.hideEmptySets;
            state.nodeTree = buildTypeTree(state.univ as AlloySignature, state.hideEmptySets);
        }
    },
    extraReducers: builder =>
        builder.addCase(setInstance, (state, action: PayloadAction<AlloyInstance | null>) => {

            const instance = action.payload;

            if (instance !== null) {

                const signatures = instance.signatures();
                const univ = signatures.find(sig => sig.id() === 'univ') || null;

                // Build the signature tree using only IDs
                state.univ = univ;
                state.nodeTree = buildTypeTree(univ, state.hideEmptySets);

                // For all maps, keeps existing signatures, get rid of ones that
                // no longer exist, and add new ones
                state.collapsed = Map(signatures.map(sig => {
                    const id = sig.id();
                    return state.collapsed.has(id)
                        ? [id, !!state.collapsed.get(id)]
                        : [id, false];
                }));

                state.hideDisconnected = Map(signatures.map(sig => {
                    const id = sig.id();
                    return state.hideDisconnected.has(id)
                        ? [id, !!state.hideDisconnected.get(id)]
                        : [id, true];
                }));

                state.labels = Map(signatures.map(sig => {
                    const id = sig.id();
                    return state.labels.has(id)
                        ? [id, cloneLabelStyle(state.labels.get(id)!)]
                        : [id, {}];
                }));

                state.shapes = Map(signatures.map(sig => {
                    const id = sig.id();
                    return state.shapes.has(id)
                        ? [id, cloneShapeStyle(state.shapes.get(id)!)]
                        : [id, {}];
                }));

                // If an item was selected, make sure it still exists
                if (state.selected && !state.shapes.has(state.selected)){
                    state.selected = null;
                }

            } else {

                state.collapsed = Map();
                state.hideDisconnected = Map();
                state.labels = Map();
                state.nodeTree = null;
                state.shapes = Map();
                state.selected = null;
                state.univ = null;

            }

        })
});

export const {
    clearAll,
    clearCurrent,
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setFill,
    setHeight,
    setLabelColor,
    setLabelSize,
    setRadius,
    setShape,
    setStroke,
    setStrokeWidth,
    setWidth,
    toggleCollapseNodeStyle,
    toggleHideDisconnected,
    toggleHideEmptySets
} = nodeStylingSlice.actions;
export default nodeStylingSlice.reducer;
