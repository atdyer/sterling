import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloyInstance } from 'alloy-ts';

export interface AlloyState {
    instance: AlloyInstance | null
}

const initialState: AlloyState = {
    instance: null
};

const alloySlice = createSlice({
    name: 'alloy',
    initialState: initialState,
    reducers: {

        setInstance (state, action: PayloadAction<AlloyInstance | null>) {

            state.instance = action.payload;

        }

    }
});

export const { setInstance } = alloySlice.actions;
export default alloySlice.reducer;