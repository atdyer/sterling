import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Sterling view types
export type MainView = 'graph' | 'table';
export type TableView = 'settings' | 'evaluator' | null;
export type GraphView = 'settings' | 'layout' | 'node' | 'edge' | 'evaluator' | null;

// Sterling state
export interface SterlingState {
    mainView: MainView
    tableView: TableView
    graphView: GraphView
}

const initialState: SterlingState = {
    mainView: 'graph',
    tableView: 'settings',
    graphView: 'settings'
};

const sterlingSlice = createSlice({
    name: 'sterling',
    initialState: initialState,
    reducers: {

        setGraphView (state, action: PayloadAction<GraphView>) {
            state.graphView = action.payload;
        },

        setMainView (state, action: PayloadAction<MainView>) {
            state.mainView = action.payload;
        },

        setTableView (state, action: PayloadAction<TableView>) {
            state.tableView = action.payload;
        }

    }
});

export const {
    setGraphView,
    setMainView,
    setTableView
} = sterlingSlice.actions;
export default sterlingSlice.reducer;
