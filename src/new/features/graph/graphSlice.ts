import {
    CircleStyle,
    convertToShape,
    Graph,
    LabelStyle,
    RectangleStyle,
    ShapeStyle
} from '@atdyer/graph-js';
import { cloneLabelStyle } from '@atdyer/graph-js/dist/styles/LabelStyle';
import { cloneShapeStyle } from '@atdyer/graph-js/dist/styles/ShapeStyle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloyInstance } from 'alloy-ts';
import { Map } from 'immutable';
import { setInstance } from '../../alloy/alloySlice';
import { buildSignatureIDTree, Tree } from './graphTypes';

export interface GraphState {
    collapsed: Map<string, boolean>
    collapseLayout: boolean
    collapseTheme: boolean
    graph: Graph
    nodeLabels: Map<string, LabelStyle>
    selected: string | null
    shapes: Map<string, ShapeStyle>
    signatureTree: Tree | null
}

const initialState: GraphState = {
    collapsed: Map(),
    collapseLayout: false,
    collapseTheme: false,
    graph: new Graph(),
    nodeLabels: Map(),
    selected: null,
    shapes: Map(),
    signatureTree: null
};

const graphSlice = createSlice({
    name: 'graph',
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
        setNodeLabelColor (state, action: PayloadAction<string>) {
            if (state.selected) {
                const label = state.nodeLabels.get(state.selected);
                const newlabel = label ? cloneLabelStyle(label) : {};
                newlabel.color = action.payload;
                state.nodeLabels = state.nodeLabels.set(state.selected, newlabel);
            }
        },
        setNodeLabelSize (state, action: PayloadAction<number>) {
            if (state.selected) {
                const label = state.nodeLabels.get(state.selected);
                const newlabel = label ? cloneLabelStyle(label) : {};
                newlabel.font = `${action.payload}px sans-serif`;
                state.nodeLabels = state.nodeLabels.set(state.selected, newlabel);
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
        toggleCollapseLayout (state) { state.collapseLayout = !state.collapseLayout },
        toggleCollapseTheme (state) { state.collapseTheme = !state.collapseTheme }
    },
    extraReducers: builder =>
        builder.addCase(setInstance, (state, action: PayloadAction<AlloyInstance | null>) => {

            const graph = state.graph as Graph;
            const instance = action.payload;

            if (instance) {

                // Build the signature tree using only IDs
                state.signatureTree = buildSignatureIDTree(instance);

                // For all maps, keep existing signatures, get rid of ones that
                // no longer exist, and add new ones

                state.collapsed = Map(instance.signatures().map(sig => {
                    const id = sig.id();
                    return state.collapsed.has(id)
                        ? [id, !!state.collapsed.get(id)]
                        : [id, false];
                }));

                state.nodeLabels = Map(instance.signatures().map(sig => {
                    const id = sig.id();
                    return state.nodeLabels.has(id)
                        ? [id, cloneLabelStyle(state.nodeLabels.get(id)!)]
                        : [id, {}];
                }));

                state.shapes = Map(instance.signatures().map(sig => {
                    const id = sig.id();
                    return state.shapes.has(id)
                        ? [id, cloneShapeStyle(state.shapes.get(id)!)]
                        : [id, {}];
                }));

                if (state.selected && !state.shapes.has(state.selected)){
                    state.selected = null;
                }

            }

            graph.update();

        })
});


export const {
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setFill,
    setHeight,
    setNodeLabelColor,
    setNodeLabelSize,
    setRadius,
    setShape,
    setStroke,
    setStrokeWidth,
    setWidth,
    toggleCollapseLayout,
    toggleCollapseTheme
} = graphSlice.actions;
export default graphSlice.reducer;
