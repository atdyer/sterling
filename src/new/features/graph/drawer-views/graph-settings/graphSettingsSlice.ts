import { createSlice } from '@reduxjs/toolkit';


export interface GraphSettingsState {
    axesVisible: boolean
    collapseSettings: boolean
    gridVisible: boolean
}

const initialState: GraphSettingsState = {
    axesVisible: true,
    collapseSettings: false,
    gridVisible: true
};

const graphSettingsSlice = createSlice({
    name: 'graphsettings',
    initialState: initialState,
    reducers: {
        toggleAxesVisible (state) { state.axesVisible = !state.axesVisible },
        toggleCollapseSettings (state) { state.collapseSettings = !state.collapseSettings },
        toggleGridVisible (state) { state.gridVisible = !state.gridVisible }
    }
});

export const {
    toggleAxesVisible,
    toggleCollapseSettings,
    toggleGridVisible
} = graphSettingsSlice.actions;
export default graphSettingsSlice.reducer;