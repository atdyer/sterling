import { CircleLayout, Graph } from '@atdyer/graph-js';
import { ITreeNode } from '@blueprintjs/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloyInstance, AlloySignature } from 'alloy-ts';
import { setInstance } from '../../alloy/alloySlice';
import {
    mergeAtomsToNodes,
    mergeSignaturesToStyles,
    SignatureStyleMap
} from './graphTypes';

export interface GraphState {
    collapseLayout: boolean
    collapseTheme: boolean
    graph: Graph
    selectedItem: ITreeNode | null
    sigStyles: SignatureStyleMap
    sigTree: ITreeNode | null
}

const initialState: GraphState = {
    collapseLayout: false,
    collapseTheme: false,
    graph: new Graph(),
    selectedItem: null,
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
                const selected = state.selectedItem;
                const node = findTreeNode(id, state.sigTree);
                if (selected) {
                    const curr = findTreeNode(selected.id.toString(), state.sigTree);
                    if (curr) curr.isSelected = false;
                }
                if (node) {
                    node.isSelected = true;
                    state.selectedItem = node;
                }

            }
        },
        setShape (state, action: PayloadAction<'circle' | 'rectangle' | null>) {
            const shape = action.payload;
            if (state.selectedItem) {
                const id = state.selectedItem.id.toString();
                const style = state.sigStyles[id];
                if (style) {
                    if (shape)
                        style.type = shape;
                    else
                        state.sigStyles[id] = null;
                } else if (shape) {
                    state.sigStyles[id] = {
                        type: shape
                    };
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
    setShape,
    toggleCollapseLayout,
    toggleCollapseTheme
} = graphSlice.actions;
export default graphSlice.reducer;
