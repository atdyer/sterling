import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    AlloyField,
    AlloyInstance,
    AlloySignature,
    AlloySkolem
} from 'alloy-ts';
import { setInstance } from '../../alloy/alloySlice';

// Table view types
export enum HorizontalAlignment { Left, Center, Right}
export enum LayoutDirection { Row, Column}
export enum SortDirection { Ascending, Descending}
export enum SortType { Alphabetical, Builtin, Group, Size}
export enum TablesType { All, Signatures, Fields, Skolems, Select}
export type SigFieldSkolem = AlloySignature | AlloyField | AlloySkolem;

// Table view state
export interface TableState {
    alignment: HorizontalAlignment
    collapseData: boolean
    collapseLayout: boolean
    collapseTables: boolean
    data: (SigFieldSkolem)[]
    highlightSkolems: boolean
    layoutDirection: LayoutDirection
    removeBuiltin: boolean
    removeEmpty: boolean
    removeThis: boolean
    primarySort: SortType
    primarySortDirection: SortDirection
    secondarySort: SortType
    secondarySortDirection: SortDirection
    tablesType: TablesType
}

// The initial table view state
const initialState: TableState = {
    alignment: HorizontalAlignment.Left,
    collapseData: false,
    collapseLayout: false,
    collapseTables: false,
    data: [],
    highlightSkolems: true,
    layoutDirection: LayoutDirection.Row,
    removeBuiltin: true,
    removeEmpty: true,
    removeThis: true,
    primarySort: SortType.Group,
    primarySortDirection: SortDirection.Descending,
    secondarySort: SortType.Size,
    secondarySortDirection: SortDirection.Descending,
    tablesType: TablesType.All
};

// The table slice
const tableSlice = createSlice({
    name: 'table',
    initialState: initialState,
    reducers: {
        setAlignment (state, action: PayloadAction<HorizontalAlignment>) { state.alignment = action.payload },
        setLayoutDirection (state, action: PayloadAction<LayoutDirection>) { state.layoutDirection = action.payload },
        setTableTypes (state, action: PayloadAction<TablesType>) { state.tablesType = action.payload },
        setSortDirection (state, action: PayloadAction<SortDirection>) {
            state.secondarySortDirection = state.primarySortDirection;
            state.primarySortDirection = action.payload;
        },
        setSortType (state, action: PayloadAction<SortType>) {
            state.secondarySort = state.primarySort;
            state.primarySort = action.payload;
        },
        toggleCollapseData (state) { state.collapseData = !state.collapseData },
        toggleCollapseLayout (state) { state.collapseLayout = !state.collapseLayout },
        toggleCollapseTables (state) { state.collapseTables = !state.collapseTables },
        toggleHighlightSkolems (state) {
            state.highlightSkolems = !state.highlightSkolems;
            if (state.highlightSkolems && state.tablesType === TablesType.Skolems) {
                state.tablesType = TablesType.All;
            }
        },
        toggleRemoveBuiltin (state) { state.removeBuiltin = !state.removeBuiltin },
        toggleRemoveEmpty (state) { state.removeEmpty = !state.removeEmpty },
        toggleRemoveThis (state) { state.removeThis = !state.removeThis }
    },
    extraReducers: builder =>
        builder.addCase(setInstance, (state, action: PayloadAction<AlloyInstance | null>) => {

            const instance = action.payload;

            if (instance) {

                state.data = [
                    ...instance.signatures(),
                    ...instance.fields(),
                    ...instance.skolems()
                ];

            }

        })
});

export const {
    setAlignment,
    setLayoutDirection,
    setSortDirection,
    setSortType,
    setTableTypes,
    toggleCollapseData,
    toggleCollapseLayout,
    toggleCollapseTables,
    toggleHighlightSkolems,
    toggleRemoveBuiltin,
    toggleRemoveEmpty,
    toggleRemoveThis
} = tableSlice.actions;

export default tableSlice.reducer;