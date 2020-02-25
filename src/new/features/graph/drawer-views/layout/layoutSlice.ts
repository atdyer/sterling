import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Alignment = 'UL' | 'UR' | 'DL' | 'DR' | undefined;
export type Direction = 'TB' | 'BT' | 'LR' | 'RL';
export type Ranker = 'network-simplex' | 'tight-tree' | 'longest-path';

export interface LayoutState {
    align: Alignment
    nodesep: number
    rankdir: Direction
    ranker: Ranker
    ranksep: number
}

const initialState: LayoutState = {
    align: undefined,
    nodesep: 100,
    rankdir: 'BT',
    ranker: 'network-simplex',
    ranksep: 200
};

const layoutSlice = createSlice({
    name: 'layout',
    initialState: initialState,
    reducers: {
        setAlign (state, action: PayloadAction<Alignment>) {
            state.align = action.payload;
        },
        setNodeSep (state, action: PayloadAction<number>) {
            state.nodesep = action.payload;
        },
        setRankDir (state, action: PayloadAction<Direction>) {
            state.rankdir = action.payload;
        },
        setRanker (state, action: PayloadAction<Ranker>) {
            state.ranker = action.payload;
        },
        setRankSep (state, action: PayloadAction<number>) {
            state.ranksep = action.payload;
        }
    }
});

export const {
    setAlign,
    setNodeSep,
    setRankDir,
    setRanker,
    setRankSep
} = layoutSlice.actions;
export default layoutSlice.reducer;
