import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const matrix = `const stage = d3.select(svg);
const sigs = instance.signatures();
const flds = instance.fields();

const rowsfld = flds.find(fld => fld.name() === 'rows');
const colsfld = flds.find(fld => fld.name() === 'cols');
const valsfld = flds.find(fld => fld.name() === 'vals');

const rows = parseInt(rowsfld.tuples()[0].atoms()[1].name());
const cols = parseInt(colsfld.tuples()[0].atoms()[1].name());
const w = 100;
const h = 100;

function isZero (val) {
  return val.slice(0, 4) === 'Zero';
}

const vals = valsfld.tuples().map(tup => {
  return {
    row: parseInt(tup.atoms()[1].name()),
    col: parseInt(tup.atoms()[2].name()),
    zero: isZero(tup.atoms()[3].name()),
    val: tup.atoms()[3].name()
  }
});

const cells = stage
  .selectAll('rect')
  .data(vals)
  .join('rect')
  .attr('fill', d => d.zero ? 'white' : 'steelblue')
  .attr('stroke', 'black')
  .attr('width', w)
  .attr('height', h)
  .attr('x', d => width/2 + d.col * w - cols * w/2)
  .attr('y', d => height/2 + d.row * h - rows * h/2);

const text = stage
  .selectAll('text')
  .data(vals)
  .join('text')
  .attr('x', d => width/2 + d.col * w - cols * w/2 + w/2)
  .attr('y', d => height/2 + d.row * h - rows * h/2 + h/2)
  .style('text-anchor', 'middle')
  .text(v => v.val);`;

export enum ScriptStatus {
    SUCCESS = 'success',
    PENDING = 'pending',
    ERROR = 'error'
}

export interface ScriptState {
    collapseLibraries: boolean
    collapseSettings: boolean
    collapseVariables: boolean
    height: number | null
    libraries: string[]
    script: string
    stage: 'canvas' | 'svg'
    status: ScriptStatus
    width: number | null
}

const initialState: ScriptState = {
    collapseLibraries: false,
    collapseSettings: false,
    collapseVariables: false,
    height: null,
    libraries: ['d3@5'],
    stage: 'svg',
    script: matrix,
    status: ScriptStatus.PENDING,
    width: null
};

const scriptSlice = createSlice({
    name: 'script',
    initialState: initialState,
    reducers: {
        setSize (state, action: PayloadAction<[number|null, number|null]>) {
            state.width = action.payload[0];
            state.height = action.payload[1];
        },
        setStage (state, action: PayloadAction<'canvas'|'svg'>) {
            state.stage = action.payload;
        },
        setStatus (state, action: PayloadAction<ScriptStatus>) {
            if (state.status !== action.payload)
                state.status = action.payload;
        },
        setValue (state, action: PayloadAction<string>) {
            state.script = action.payload;
        },
        toggleCollapseLibraries (state) {
            state.collapseLibraries = !state.collapseLibraries;
        },
        toggleCollapseSettings (state) {
            state.collapseSettings = !state.collapseSettings;
        },
        toggleCollapseVariables (state) {
            state.collapseVariables = !state.collapseVariables;
        }
    }
});

export const {
    setSize,
    setStage,
    setStatus,
    setValue,
    toggleCollapseLibraries,
    toggleCollapseSettings,
    toggleCollapseVariables
} = scriptSlice.actions;
export default scriptSlice.reducer;
