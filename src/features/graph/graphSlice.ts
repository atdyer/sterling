import { combineReducers } from '@reduxjs/toolkit';
import { Graph } from '@atdyer/graph-js';
import { createSlice } from '@reduxjs/toolkit';
import dataSlice from './drawer-views/data/dataSlice';
import edgeStylingSlice from './drawer-views/edge-styling/edgeStylingSlice';
import graphSettingsSlice from './drawer-views/graph-settings/graphSettingsSlice';
import layoutSlice from './drawer-views/layout/layoutSlice';
import nodeStylingSlice from './drawer-views/node-styling/nodeStylingSlice';

export interface GraphState {
    graph: Graph
}

const initialState: GraphState = {
    graph: new Graph(),
};

const graphSlice = createSlice({
    name: 'graph',
    initialState: initialState,
    reducers: {}
});

export default combineReducers({
    dataSlice,
    edgeStylingSlice,
    graphSlice: graphSlice.reducer,
    graphSettingsSlice,
    layoutSlice,
    nodeStylingSlice
});
