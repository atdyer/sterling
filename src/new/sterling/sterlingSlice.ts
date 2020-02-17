import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Sterling view types
export type MainView = 'graph' | 'table';
export type SideView = 'settings' | 'evaluator' | null;

// Sterling state
export interface SterlingState {
    mainView: MainView
    sideView: SideView
}

const initialState: SterlingState = {
    mainView: 'table',
    sideView: 'settings'
};

const sterlingSlice = createSlice({
    name: 'sterling',
    initialState: initialState,
    reducers: {

        selectMainView (state, action: PayloadAction<MainView>) {

            state.mainView = action.payload;

        },

        selectSideView (state, action: PayloadAction<SideView>) {

            if (state.sideView === action.payload) {

                state.sideView = null;

            } else {

                state.sideView = action.payload;

            }

        }

    }
});

export const { selectMainView, selectSideView } = sterlingSlice.actions;
export default sterlingSlice.reducer;