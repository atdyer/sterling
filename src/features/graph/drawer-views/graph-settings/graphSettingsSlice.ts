import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LabelPlacement } from '@atdyer/graph-js';

export interface GraphSettingsState {
    axesVisible: boolean
    bundleFactor: number
    collapseEdgeSettings: boolean
    collapseGraphSettings: boolean
    edgeLabelPlacement: LabelPlacement
    gridVisible: boolean
}

const initialState: GraphSettingsState = {
    axesVisible: true,
    bundleFactor: 0.15,
    collapseEdgeSettings: false,
    collapseGraphSettings: false,
    gridVisible: true,
    edgeLabelPlacement: 'spread'
};

const graphSettingsSlice = createSlice({
    name: 'graphsettings',
    initialState: initialState,
    reducers: {
        setBundleFactor (state, action: PayloadAction<number>) {
            const value = action.payload;
            if (value >= 0) state.bundleFactor = value;
        },
        setLabelPlacement (state, action: PayloadAction<LabelPlacement>) {
            state.edgeLabelPlacement = action.payload;
        },
        toggleAxesVisible (state) { state.axesVisible = !state.axesVisible },
        toggleCollapseEdgeSettings (state) { state.collapseEdgeSettings = !state.collapseEdgeSettings },
        toggleCollapseGraphSettings (state) { state.collapseGraphSettings = !state.collapseGraphSettings },
        toggleGridVisible (state) { state.gridVisible = !state.gridVisible }
    }
});

export const {
    setBundleFactor,
    setLabelPlacement,
    toggleAxesVisible,
    toggleCollapseEdgeSettings,
    toggleCollapseGraphSettings,
    toggleGridVisible
} = graphSettingsSlice.actions;
export default graphSettingsSlice.reducer;
