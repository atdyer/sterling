import { combineReducers } from '@reduxjs/toolkit';
import alloySlice from './alloy/alloySlice';
import graphSlice from './features/graph/graphSlice';
import sourceSlice from './features/source/sourceSlice';
import sterlingSlice from './sterling/sterlingSlice';
import tableSlice from './features/table/tableSlice';


export const sterlingApp = combineReducers({
    alloySlice,
    graphSlice,
    sourceSlice,
    sterlingSlice,
    tableSlice
});

export type RootState = ReturnType<typeof sterlingApp>;
