import {
    cloneLabelStyle,
    cloneLinkStyle,
    cloneShapeStyle,
    LabelStyle,
    LinkStyle
} from '@atdyer/graph-js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloyField, AlloyInstance, AlloySkolem } from 'alloy-ts';
import { Map } from 'immutable';
import { setInstance } from '../../../../alloy/alloySlice';
import { Tree } from '../../graphTypes';
import { buildFieldTree, buildSkolemTree } from './edgeTypes';

export interface EdgeStylingState {
    collapsed: Map<string, boolean>
    collapseEdgeStyle: boolean
    fields: AlloyField[]
    hideEmptyRelations: boolean
    labelStyles: Map<string, LabelStyle>
    linkStyles: Map<string, LinkStyle>
    selected: string | null
    skolems: AlloySkolem[]
    treeField: Tree | null
    treeSkolem: Tree | null
}

const initialState: EdgeStylingState = {
    collapsed: Map({
        Fields: false,
        Skolems: false
    }),
    collapseEdgeStyle: false,
    fields: [],
    hideEmptyRelations: true,
    labelStyles: Map(),
    linkStyles: Map(),
    selected: null,
    skolems: [],
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
        setLabelColor (state, action: PayloadAction<string>) {
            if (state.selected) {
                const label = state.labelStyles.get(state.selected);
                const newlabel = label ? cloneLabelStyle(label) : {};
                newlabel.color = action.payload;
                state.labelStyles = state.labelStyles.set(state.selected, newlabel);
            }
        },
        setLabelSize (state, action: PayloadAction<number>) {
            if (state.selected) {
                const label = state.labelStyles.get(state.selected);
                const newlabel = label ? cloneLabelStyle(label) : {};
                newlabel.font = `${action.payload}px sans-serif`;
                state.labelStyles = state.labelStyles.set(state.selected, newlabel);
            }
        },
        setStroke (state, action: PayloadAction<string>) {
            if (state.selected) {
                const shape = state.linkStyles.get(state.selected);
                if (shape) {
                    const newshape = cloneShapeStyle(shape)!;
                    newshape.stroke = action.payload;
                    state.linkStyles = state.linkStyles.set(state.selected, newshape);
                }
            }
        },
        setStrokeWidth (state, action: PayloadAction<number|null>) {
            if (state.selected) {
                const shape = state.linkStyles.get(state.selected);
                if (shape) {
                    const newshape = cloneShapeStyle(shape)!;
                    if (action.payload === null) {
                        delete newshape.strokeWidth;
                    } else {
                        newshape.strokeWidth = action.payload;
                    }
                    state.linkStyles = state.linkStyles.set(state.selected, newshape);
                }
            }
        },
        toggleCollapseEdgeStyle (state) {
            state.collapseEdgeStyle = !state.collapseEdgeStyle;
        },
        toggleHideEmptyRelations (state) {
            state.hideEmptyRelations = !state.hideEmptyRelations;
            state.treeField = buildFieldTree(state.fields as AlloyField[], state.hideEmptyRelations);
            state.treeSkolem = buildSkolemTree(state.skolems as AlloySkolem[], state.hideEmptyRelations);
        }
    },
    extraReducers: builder =>
        builder.addCase(setInstance, (state, action: PayloadAction<AlloyInstance | null>) => {

            const instance = action.payload;

            if (instance) {

                const fields = instance.fields();
                const skolems = instance.skolems().filter(s => s.arity() > 1);
                const both = [...fields, ...skolems];

                state.fields = fields;
                state.skolems = skolems;
                state.treeField = buildFieldTree(fields, state.hideEmptyRelations);
                state.treeSkolem = buildSkolemTree(skolems, state.hideEmptyRelations);

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

                state.fields = [];
                state.labelStyles = Map();
                state.linkStyles = Map();
                state.selected = null;
                state.skolems = [];
                state.treeField = null;
                state.treeSkolem = null;

            }

        })
});

export const {
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setLabelColor,
    setLabelSize,
    setStroke,
    setStrokeWidth,
    toggleCollapseEdgeStyle,
    toggleHideEmptyRelations
} = edgeStylingSlice.actions;
export default edgeStylingSlice.reducer;
