import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ScriptState {
    value: string
}

const initialState: ScriptState = {
    value: ''
};

const scriptSlice = createSlice({
    name: 'script',
    initialState: initialState,
    reducers: {
        setValue (state, action: PayloadAction<string>) {
            state.value = action.payload;
        }
    }
});

export const {
    setValue
} = scriptSlice.actions;
export default scriptSlice.reducer;
