import { cloneLabelStyle, LabelStyle, LinkStyle } from '@atdyer/graph-js';
import { cloneLinkStyle } from '@atdyer/graph-js/dist/styles/LinkStyle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloyInstance } from 'alloy-ts';
import { Map } from 'immutable';
import { setInstance } from '../../../../alloy/alloySlice';
import { Tree } from '../../graphTypes';
import { buildFieldTree, buildSkolemTree } from './edgeTypes';

export interface EdgeStylingState {
    collapsed: Map<string, boolean>
    collapseEdgeStyle: boolean
    labelStyles: Map<string, LabelStyle>
    linkStyles: Map<string, LinkStyle>
    selected: string | null
    treeField: Tree | null
    treeSkolem: Tree | null
}

const initialState: EdgeStylingState = {
    collapsed: Map({
        Fields: false,
        Skolems: false
    }),
    collapseEdgeStyle: false,
    labelStyles: Map(),
    linkStyles: Map(),
    selected: null,
    treeField: null,
    treeSkolem: null
};

const edgeStylingSlice = createSlice({
    name: 'edgestyles',
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
            if (state.linkStyles.has(target)) state.selected = target;
        },
        toggleCollapseEdgeStyle (state) {
            state.collapseEdgeStyle = !state.collapseEdgeStyle;
        }
    },
    extraReducers: builder =>
        builder.addCase(setInstance, (state, action: PayloadAction<AlloyInstance | null>) => {

            const instance = action.payload;

            if (instance) {

                const fields = instance.fields();
                const skolems = instance.skolems().filter(s => s.arity() > 1);
                const both = [...fields, ...skolems];

                state.treeField = buildFieldTree(fields);
                state.treeSkolem = buildSkolemTree(skolems);

                state.labelStyles = Map(both.map(item => {
                    const id = item.id();
                    return state.labelStyles.has(id)
                        ? [id, cloneLabelStyle(state.labelStyles.get(id)!)]
                        : [id, {}]
                }));

                state.linkStyles = Map(both.map(item => {
                    const id = item.id();
                    return state.linkStyles.has(id)
                        ? [id, cloneLinkStyle(state.linkStyles.get(id)!)]
                        : [id, {}]
                }));

            } else {

                state.labelStyles = Map();
                state.linkStyles = Map();
                state.selected = null;
                state.treeField = null;
                state.treeSkolem = null;

            }

        })
});

export const {
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    toggleCollapseEdgeStyle
} = edgeStylingSlice.actions;
export default edgeStylingSlice.reducer;
