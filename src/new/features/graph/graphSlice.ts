import { combineReducers } from '@reduxjs/toolkit';
import { Graph } from '@atdyer/graph-js';
import { createSlice } from '@reduxjs/toolkit';
import dataSlice from './drawer-views/data/dataSlice';
import edgeStylingSlice from './drawer-views/edge-styling/edgeStylingSlice';
import nodeStylingSlice from './drawer-views/node-styling/nodeStylingSlice';
import graphSettingsSlice from './drawer-views/graph-settings/graphSettingsSlice';

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
    nodeStylingSlice
});
