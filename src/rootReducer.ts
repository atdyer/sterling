import { combineReducers } from '@reduxjs/toolkit';
import graphSlice from './features/graph/graphSlice';
import sourceSlice from './features/source/sourceSlice';
import sterlingSlice from './sterling/sterlingSlice';
import tableSlice from './features/table/tableSlice';


export const sterlingApp = combineReducers({
    graphSlice,
    sourceSlice,
    sterlingSlice,
    tableSlice
});

export type RootState = ReturnType<typeof sterlingApp>;
