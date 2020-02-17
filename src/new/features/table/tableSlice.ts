import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloyInstance, AlloySkolem } from 'alloy-ts';
import { setInstance } from '../../alloy/alloySlice';
import {
    HorizontalAlignment,
    LayoutDirection,
    SigFieldSkolem,
    SKOLEM_COLORS,
    SortDirection,
    SortMethod,
    SortType,
    TablesType
} from './tableTypes';

// Table view state
export interface TableState {
    alignment: HorizontalAlignment
    collapseData: boolean
    collapseLayout: boolean
    collapseTables: boolean
    data: SigFieldSkolem[]
    dataSelected: SigFieldSkolem[]
    highlightSkolems: boolean
    layoutDirection: LayoutDirection
    removeBuiltin: boolean
    removeEmpty: boolean
    removeThis: boolean
    primarySort: SortType
    secondarySort: SortType
    skolemColors: Map<AlloySkolem, string>
    tablesType: TablesType
}

// The initial table view state
const initialState: TableState = {
    alignment: HorizontalAlignment.Left,
    collapseData: false,
    collapseLayout: false,
    collapseTables: false,
    data: [],
    dataSelected: [],
    highlightSkolems: true,
    layoutDirection: LayoutDirection.Row,
    removeBuiltin: true,
    removeEmpty: true,
    removeThis: true,
    primarySort: {
        method: SortMethod.Group,
        direction: SortDirection.Descending
    },
    secondarySort: {
        method: SortMethod.Size,
        direction: SortDirection.Descending
    },
    skolemColors: new Map(),
    tablesType: TablesType.All
};

// The table slice
const tableSlice = createSlice({
    name: 'table',
    initialState: initialState,
    reducers: {
        clearSelectedData (state) { state.dataSelected = [] },
        deselectData (state, action: PayloadAction<SigFieldSkolem>) {
            const index = state.dataSelected.indexOf(action.payload);
            if (index !== -1) {
                state.dataSelected.splice(index, 1);
            }
            state.tablesType = TablesType.Select;
        },
        selectData (state, action: PayloadAction<SigFieldSkolem>) {
            if (!state.dataSelected.includes(action.payload)) {
                state.dataSelected.push(action.payload);
            }
            state.tablesType = TablesType.Select;
        },
        setAlignment (state, action: PayloadAction<HorizontalAlignment>) { state.alignment = action.payload },
        setLayoutDirection (state, action: PayloadAction<LayoutDirection>) { state.layoutDirection = action.payload },
        setSort (state, action: PayloadAction<SortType>) {
            if (state.primarySort.method !== action.payload.method) {
                state.secondarySort = state.primarySort;
            }
            state.primarySort = action.payload;
        },
        setTableTypes (state, action: PayloadAction<TablesType>) { state.tablesType = action.payload },
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

                const skolems = instance.skolems();

                state.data = [
                    ...instance.signatures(),
                    ...instance.fields(),
                    ...skolems
                ];

                state.skolemColors = new Map(skolems.map((skolem, i) => {
                    return [skolem, SKOLEM_COLORS[i % skolems.length]];
                }));

            }

        })
});

export const {
    clearSelectedData,
    deselectData,
    selectData,
    setAlignment,
    setLayoutDirection,
    setSort,
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
