import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloyInstance } from 'alloy-ts';

// Sterling view types
export type MainView = 'graph' | 'table' | 'source';
export type TableView = 'settings' | 'evaluator' | null;
export type GraphView = 'node' | 'edge' | 'layout' | 'settings' | 'evaluator' | null;
export type SourceView = 'files' | 'evaluator' | null;

// Sterling state
export interface SterlingState {
    instance: AlloyInstance | null
    mainView: MainView
    tableView: TableView
    graphView: GraphView
    sourceView: SourceView
    welcomeDescription: string
    welcomeTitle: string
}

const initialState: SterlingState = {
    instance: null,
    mainView: 'graph',
    tableView: null,
    graphView: null,
    sourceView: 'files',
    welcomeDescription: 'Use Alloy to generate an instance.',
    welcomeTitle: 'Welcome to Sterling'
};

const sterlingSlice = createSlice({
    name: 'sterling',
    initialState: initialState,
    reducers: {

        setGraphView (state, action: PayloadAction<GraphView>) {
            state.graphView = action.payload === state.graphView
                ? null
                : action.payload;
        },

        setInstance (state, action: PayloadAction<AlloyInstance | null>) {

            state.instance = action.payload;

        },

        setMainView (state, action: PayloadAction<MainView>) {
            state.mainView = action.payload;
        },

        setSourceView (state, action: PayloadAction<SourceView>) {
            state.sourceView = action.payload === state.sourceView
                ? null
                : action.payload;
        },

        setTableView (state, action: PayloadAction<TableView>) {
            state.tableView = action.payload === state.tableView
                ? null
                : action.payload;
        }

    }
});

export const {
    setGraphView,
    setInstance,
    setMainView,
    setSourceView,
    setTableView
} = sterlingSlice.actions;
export default sterlingSlice.reducer;
