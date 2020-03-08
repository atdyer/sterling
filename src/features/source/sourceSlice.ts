import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloySource } from 'alloy-ts';
import { setInstance } from '../../sterling/sterlingSlice';

export interface SourceState {
    selected: AlloySource | null
}

const initialState: SourceState = {
    selected: null
};

const sourceSlice = createSlice({
    name: 'source',
    initialState: initialState,
    reducers: {
        setSelected (state, action: PayloadAction<AlloySource>) {
            state.selected = action.payload;
        }
    },
    extraReducers: build =>
        build.addCase(setInstance, state => { state.selected = null })
});

export const {
    setSelected
} = sourceSlice.actions;
export default sourceSlice.reducer;
