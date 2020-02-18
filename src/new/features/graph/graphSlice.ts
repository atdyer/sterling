import { CircleLayout, Graph } from '@atdyer/graph-js';
import { ITreeNode } from '@blueprintjs/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloyInstance, AlloySignature } from 'alloy-ts';
import { setInstance } from '../../alloy/alloySlice';
import {
    convertStyle,
    mergeAtomsToNodes,
    mergeSignaturesToStyles,
    SignatureStyle,
    SignatureStyleMap
} from './graphTypes';

export interface GraphState {
    collapseLayout: boolean
    collapseTheme: boolean
    graph: Graph
    selectedItem: ITreeNode | null
    selectedItemStyle: SignatureStyle
    sigStyles: SignatureStyleMap
    sigTree: ITreeNode | null
}

const initialState: GraphState = {
    collapseLayout: false,
    collapseTheme: false,
    graph: new Graph(),
    selectedItem: null,
    selectedItemStyle: null,
    sigStyles: {},
    sigTree: null
};

const graphSlice = createSlice({
    name: 'graph',
    initialState: initialState,
    reducers: {
        collapseTreeNode (state, action: PayloadAction<ITreeNode>) {
            const id = action.payload.id.toString();
            if (state.sigTree) {
                const node = findTreeNode(id, state.sigTree);
                if (node) node.isExpanded = false;
            }
        },
        expandTreeNode (state, action: PayloadAction<ITreeNode>) {
            const id = action.payload.id.toString();
            if (state.sigTree) {
                const node = findTreeNode(id, state.sigTree);
                if (node) node.isExpanded = true;
            }
        },
        selectItem (state, action: PayloadAction<ITreeNode>) {
            const id = action.payload.id.toString();
            if (state.sigTree) {
                const curr = state.selectedItem
                    ? findTreeNode(state.selectedItem.id.toString(), state.sigTree)
                    : null;
                const next = findTreeNode(id, state.sigTree);
                if (curr) curr.isSelected = false;
                if (next) {
                    next.isSelected = true;
                    state.selectedItem = next;
                    state.selectedItemStyle = state.sigStyles[id] || null;
                }

            }
        },
        setHeight (state, action: PayloadAction<number>) {
            const item = state.selectedItem;
            const height = action.payload;
            if (item && state.selectedItemStyle && state.selectedItemStyle.type === 'rectangle' && height > 0) {
                state.selectedItemStyle.height = height;
                state.sigStyles[item.id] = state.selectedItemStyle;
            }
        },
        setRadius (state, action: PayloadAction<number>) {
            const item = state.selectedItem;
            const radius = action.payload;
            if (item && state.selectedItemStyle && state.selectedItemStyle.type === 'circle' && radius > 0) {
                state.selectedItemStyle.radius = radius;
                state.sigStyles[item.id] = state.selectedItemStyle;
            }
        },
        setShape (state, action: PayloadAction<'circle' | 'rectangle' | null>) {
            const shape = action.payload;
            if (state.selectedItem) {
                const id = state.selectedItem.id.toString();
                const style = state.sigStyles[id] || null;
                const newStyle = convertStyle(style, shape);
                state.sigStyles[id] = newStyle;
                state.selectedItemStyle = newStyle;
            }
        },
        setWidth (state, action: PayloadAction<number>) {
            const item = state.selectedItem;
            const width = action.payload;
            if (item && state.selectedItemStyle && state.selectedItemStyle.type === 'rectangle' && width > 0) {
                state.selectedItemStyle.width = width;
                state.sigStyles[item.id] = state.selectedItemStyle;
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

                setNodes(graph, instance);
                mergeSignaturesToStyles(state.sigStyles, instance.signatures());
                state.sigTree = buildSigTree(instance);

            }

            graph.update();

        })
});

function buildSigTree (instance: AlloyInstance): ITreeNode | null {

    const univ = instance.signatures().find(sig => sig.id() === 'univ');

    if (!univ) return null;

    const populate = (sig: AlloySignature): ITreeNode => {
        const children = sig.subTypes().map(populate);
        return {
            id: sig.id(),
            icon: 'id-number',
            label: sig.name(),
            isExpanded: true,
            childNodes: children.length ? children : undefined
        }
    };

    return populate(univ);
}

function findTreeNode (id: string, tree: ITreeNode): ITreeNode | null {
    if (tree.id === id) return tree;
    if (tree.childNodes) {
        for (let i = 0; i < tree.childNodes.length; ++i) {
            const found = findTreeNode(id, tree.childNodes[i]);
            if (found) return found;
        }
    }
    return null;
}

function setNodes (graph: Graph, instance: AlloyInstance) {

    const nodes = graph.nodes();
    const newnodes = mergeAtomsToNodes(nodes, instance.atoms());
    graph.nodes(newnodes);
    const circle = new CircleLayout();
    circle.apply(graph);

}

export const {
    collapseTreeNode,
    expandTreeNode,
    selectItem,
    setHeight,
    setRadius,
    setShape,
    setWidth,
    toggleCollapseLayout,
    toggleCollapseTheme
} = graphSlice.actions;
export default graphSlice.reducer;
