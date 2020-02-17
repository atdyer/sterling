import { combineReducers } from '@reduxjs/toolkit';
import alloySlice from './alloy/alloySlice';
import graphSlice from './features/graph/graphSlice';
import sterlingSlice from './sterling/sterlingSlice';
import tableSlice from './features/table/tableSlice';


export const sterlingApp = combineReducers({
    alloySlice,
    graphSlice,
    sterlingSlice,
    tableSlice
});

export type RootState = ReturnType<typeof sterlingApp>;
