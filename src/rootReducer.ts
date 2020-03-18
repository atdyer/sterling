import { combineReducers } from '@reduxjs/toolkit';
import graphSlice from './features/graph/graphSlice';
import scriptSlice from './features/script/scriptSlice';
import sourceSlice from './features/source/sourceSlice';
import sterlingSlice from './sterling/sterlingSlice';
import tableSlice from './features/table/tableSlice';


export const sterlingApp = combineReducers({
    graphSlice,
    scriptSlice,
    sourceSlice,
    sterlingSlice,
    tableSlice
});

export type RootState = ReturnType<typeof sterlingApp>;
