import {
    cloneLabelStyle,
    cloneLinkStyle,
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
    hideEmptyFields: boolean
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
    hideEmptyFields: true,
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
        clearAll (state) {
            state.labelStyles = state.labelStyles.map(() => ({}));
            state.linkStyles = state.linkStyles.map(() => ({}));
        },
        clearCurrent (state) {
            if (state.selected) {
                state.labelStyles = state.labelStyles.set(state.selected, {});
                state.linkStyles = state.linkStyles.set(state.selected, {});
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
            if (state.linkStyles.has(target)
                || target === 'Fields'
                || target === 'Skolems') state.selected = target;
        },
        setLabelColor (state, action: PayloadAction<string|null>) {
            if (state.selected) {
                const label = state.labelStyles.get(state.selected);
                if (label) {
                    const color = action.payload;
                    const newlabel = label ? cloneLabelStyle(label) : {};
                    color === null
                        ? delete newlabel.color
                        : newlabel.color = color;
                    state.labelStyles = state.labelStyles.set(state.selected, newlabel);
                }
            }
        },
        setLabelSize (state, action: PayloadAction<string>) {
            if (state.selected) {
                const label = state.labelStyles.get(state.selected);
                if (label) {
                    const size = parseInt(action.payload);
                    const newlabel = label ? cloneLabelStyle(label) : {};
                    isNaN(size) || size === 0
                        ? delete newlabel.font
                        : newlabel.font = `${size}px sans-serif`;
                    state.labelStyles = state.labelStyles.set(state.selected, newlabel);
                }
            }
        },
        setStroke (state, action: PayloadAction<string|null>) {
            if (state.selected) {
                const link = state.linkStyles.get(state.selected);
                if (link) {
                    const color = action.payload;
                    const newlink = cloneLinkStyle(link)!;
                    color === null
                        ? delete newlink.stroke
                        : newlink.stroke = color;
                    state.linkStyles = state.linkStyles.set(state.selected, newlink);
                }
            }
        },
        setStrokeWidth (state, action: PayloadAction<string>) {
            if (state.selected) {
                const link = state.linkStyles.get(state.selected);
                if (link) {
                    const width = parseInt(action.payload);
                    const newlink = cloneLinkStyle(link)!;
                    isNaN(width) || width === 0
                        ? delete newlink.strokeWidth
                        : newlink.strokeWidth = width;
                    state.linkStyles = state.linkStyles.set(state.selected, newlink);
                }
            }
        },
        toggleCollapseEdgeStyle (state) {
            state.collapseEdgeStyle = !state.collapseEdgeStyle;
        },
        toggleHideEmptyFields (state) {
            state.hideEmptyFields = !state.hideEmptyFields;
            state.treeField = buildFieldTree(state.fields as AlloyField[], state.hideEmptyFields);
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
                state.treeField = buildFieldTree(fields, state.hideEmptyFields);
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

                if (!state.labelStyles.has('Fields'))
                    state.labelStyles = state.labelStyles.set('Fields', {});
                if (!state.labelStyles.has('Skolems'))
                    state.labelStyles = state.labelStyles.set('Skolems', {});
                if (!state.linkStyles.has('Fields'))
                    state.linkStyles = state.linkStyles.set('Fields', {});
                if (!state.linkStyles.has('Skolems'))
                    state.linkStyles = state.linkStyles.set('Skolems', {});

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
    clearAll,
    clearCurrent,
    collapseTreeNode,
    expandTreeNode,
    selectTreeNode,
    setLabelColor,
    setLabelSize,
    setStroke,
    setStrokeWidth,
    toggleCollapseEdgeStyle,
    toggleHideEmptyFields
} = edgeStylingSlice.actions;
export default edgeStylingSlice.reducer;
