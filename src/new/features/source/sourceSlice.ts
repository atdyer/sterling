import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloySource } from 'alloy-ts';

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
    }
});

export const {
    setSelected
} = sourceSlice.actions;
export default sourceSlice.reducer;
