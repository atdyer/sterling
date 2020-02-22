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
import { AlloyInstance } from 'alloy-ts';
import { Map } from 'immutable';
import { setInstance } from '../../../../alloy/alloySlice';
import { Tree } from '../../graphTypes';
import { buildTypeTree } from './nodeTypes';

export interface NodeStylingState {
    collapsed: Map<string, boolean>
    collapseNodeStyle: boolean
    labels: Map<string, LabelStyle>
    nodeTree: Tree | null
    selected: string | null
    shapes: Map<string, ShapeStyle>
}

const initialState: NodeStylingState = {
    collapsed: Map(),
    collapseNodeStyle: false,
    labels: Map(),
    nodeTree: null,
    selected: null,
    shapes: Map()
};

const nodeStylingSlice = createSlice({
    name: 'nodestyles',
    initialState: initialState,
    reducers: {
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
        setFill (state, action: PayloadAction<string>) {
            if (state.selected) {
                const shape = state.shapes.get(state.selected);
                const newshape = shape ? cloneShapeStyle(shape) : {};
                newshape.fill = action.payload;
                state.shapes = state.shapes.set(state.selected, newshape);
            }
        },
        setHeight (state, action: PayloadAction<number>) {
            if (state.selected) {
                const height = action.payload;
                const shape = state.shapes.get(state.selected);
                if (shape && shape.type === 'rectangle') {
                    const newshape = cloneShapeStyle(shape) as RectangleStyle;
                    newshape.height = height;
                    state.shapes = state.shapes.set(state.selected, newshape);
                }
            }
        },
        setLabelColor (state, action: PayloadAction<string>) {
            if (state.selected) {
                const label = state.labels.get(state.selected);
                const newlabel = label ? cloneLabelStyle(label) : {};
                newlabel.color = action.payload;
                state.labels = state.labels.set(state.selected, newlabel);
            }
        },
        setLabelSize (state, action: PayloadAction<number>) {
            if (state.selected) {
                const label = state.labels.get(state.selected);
                const newlabel = label ? cloneLabelStyle(label) : {};
                newlabel.font = `${action.payload}px sans-serif`;
                state.labels = state.labels.set(state.selected, newlabel);
            }
        },
        setRadius (state, action: PayloadAction<number>) {
            if (state.selected) {
                const radius = action.payload;
                const shape = state.shapes.get(state.selected);
                if (shape && shape.type === 'circle') {
                    const newshape = cloneShapeStyle(shape) as CircleStyle;
                    newshape.radius = radius;
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
        setStroke (state, action: PayloadAction<string>) {
            if (state.selected) {
                const shape = state.shapes.get(state.selected);
                if (shape) {
                    const newshape = cloneShapeStyle(shape)!;
                    newshape.stroke = action.payload;
                    state.shapes = state.shapes.set(state.selected, newshape);
                }
            }
        },
        setStrokeWidth (state, action: PayloadAction<number|null>) {
            if (state.selected) {
                const shape = state.shapes.get(state.selected);
                if (shape) {
                    const newshape = cloneShapeStyle(shape)!;
                    if (action.payload === null) {
                        delete newshape.strokeWidth;
                    } else {
                        newshape.strokeWidth = action.payload;
                    }
                    state.shapes = state.shapes.set(state.selected, newshape);
                }
            }
        },
        setWidth (state, action: PayloadAction<number>) {
            if (state.selected) {
                const width = action.payload;
                const shape = state.shapes.get(state.selected);
                if (shape && shape.type === 'rectangle') {
                    const newshape = cloneShapeStyle(shape) as RectangleStyle;
                    newshape.width = width;
                    state.shapes = state.shapes.set(state.selected, newshape);
                }
            }
        },
        toggleCollapseNodeStyle (state) {
            state.collapseNodeStyle = !state.collapseNodeStyle;
        }
    },
    extraReducers: builder =>
        builder.addCase(setInstance, (state, action: PayloadAction<AlloyInstance | null>) => {

            const instance = action.payload;

            if (instance !== null) {

                const signatures = instance.signatures();
                const univ = signatures.find(sig => sig.id() === 'univ');

                // Build the signature tree using only IDs
                state.nodeTree = buildTypeTree(univ);

                // For all maps, keeps existing signatures, get rid of ones that
                // no longer exist, and add new ones
                state.collapsed = Map(signatures.map(sig => {
                    const id = sig.id();
                    return state.collapsed.has(id)
                        ? [id, !!state.collapsed.get(id)]
                        : [id, false];
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
                state.labels = Map();
                state.nodeTree = null;
                state.shapes = Map();
                state.selected = null;

            }

        })
});

export const {
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
    toggleCollapseNodeStyle
} = nodeStylingSlice.actions;
export default nodeStylingSlice.reducer;
