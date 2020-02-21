import { combineReducers } from '@reduxjs/toolkit';
import { Graph } from '@atdyer/graph-js';
import { createSlice } from '@reduxjs/toolkit';
import dataSlice from './drawer-views/data/dataSlice';
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
    graphSlice: graphSlice.reducer,
    graphSettingsSlice,
    nodeStylingSlice
});
