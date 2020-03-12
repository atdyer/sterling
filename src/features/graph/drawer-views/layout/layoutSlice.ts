import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Alignment = 'UL' | 'UR' | 'DL' | 'DR' | undefined;
export type Direction = 'TB' | 'BT' | 'LR' | 'RL';
export type Ranker = 'network-simplex' | 'tight-tree' | 'longest-path';

export interface LayoutState {
    align: Alignment
    collapseLayout: boolean
    collapseQuickLayout: boolean
    collapseZoom: boolean
    nodesep: number
    rankdir: Direction
    ranker: Ranker
    ranksep: number
}

const initialState: LayoutState = {
    align: undefined,
    collapseLayout: false,
    collapseQuickLayout: false,
    collapseZoom: false,
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
        },
        toggleCollapseLayout (state) {
            state.collapseLayout = !state.collapseLayout;
        },
        toggleCollapseQuickLayout (state) {
            state.collapseQuickLayout = !state.collapseQuickLayout;
        },
        toggleCollapseZoom (state) {
            state.collapseZoom = !state.collapseZoom;
        }
    }
});

export const {
    setAlign,
    setNodeSep,
    setRankDir,
    setRanker,
    setRankSep,
    toggleCollapseLayout,
    toggleCollapseQuickLayout,
    toggleCollapseZoom
} = layoutSlice.actions;
export default layoutSlice.reducer;
