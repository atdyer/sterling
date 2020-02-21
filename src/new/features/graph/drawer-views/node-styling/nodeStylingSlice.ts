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

export interface NodeStylingState {
    collapsed: Map<string, boolean>
    collapseNodeStyle: boolean
    labels: Map<string, LabelStyle>
    selected: string | null
    shapes: Map<string, ShapeStyle>
    signatureTree: Tree | null
}

const initialState: NodeStylingState = {
    collapsed: Map(),
    collapseNodeStyle: false,
    labels: Map(),
    selected: null,
    shapes: Map(),
    signatureTree: null
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

                // Build the signature tree using only IDs
                state.signatureTree = buildSignatureIDTree(instance);

                // For all maps, keeps existing signatures, get rid of ones that
                // no longer exist, and add new ones
                state.collapsed = Map(instance.signatures().map(sig => {
                    const id = sig.id();
                    return state.collapsed.has(id)
                        ? [id, !!state.collapsed.get(id)]
                        : [id, false];
                }));

                state.labels = Map(instance.signatures().map(sig => {
                    const id = sig.id();
                    return state.labels.has(id)
                        ? [id, cloneLabelStyle(state.labels.get(id)!)]
                        : [id, {}];
                }));

                state.shapes = Map(instance.signatures().map(sig => {
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

                state.signatureTree = null;
                state.collapsed = Map();
                state.labels = Map();
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