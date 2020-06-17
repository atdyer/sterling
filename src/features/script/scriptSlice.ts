import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloyInstance } from 'alloy-ts';
import { AlloyInstance as ProxyInstance } from './alloy-proxy/AlloyInstance';
import { List, Map } from 'immutable'
import { setInstance } from '../../sterling/sterlingSlice';

export enum ScriptStatus {
    SUCCESS = 'success',
    PENDING = 'pending',
    ERROR = 'error'
}

export interface ScriptState {
    atoms: Map<string, string[]>
    autorun: boolean
    collapseInstanceVariables: boolean
    collapseLibraries: boolean
    collapseStageVariables: boolean
    height: number | null
    instance: ProxyInstance | null
    libraries: List<string>
    overlay: boolean
    projections: Map<string, string>
    script: string
    stage: 'canvas' | 'svg' | 'div'
    status: ScriptStatus
    unprojected: List<string>
    width: number | null
}

const initialState: ScriptState = {
    atoms: Map(),
    autorun: true,
    collapseInstanceVariables: false,
    collapseLibraries: false,
    collapseStageVariables: false,
    height: null,
    instance: null,
    libraries: List(['d3', 'cytoscape']),
    overlay: true,
    projections: Map(),
    stage: 'div',
    script: '',
    status: ScriptStatus.PENDING,
    unprojected: List(),
    width: null
};

const scriptSlice = createSlice({
    name: 'script',
    initialState: initialState,
    reducers: {
        addLibrary (state, action: PayloadAction<string>) {
            if (!state.libraries.includes(action.payload)) {
                state.libraries = state.libraries.push(action.payload);
            }
        },
        addProjection (state, action: PayloadAction<string>) {
            const sig = action.payload;
            const atoms = state.atoms.get(sig);
            if (atoms && atoms.length) {
                const atom = atoms[0];
                state.projections = state.projections.set(sig, atom);
                const index = state.unprojected.indexOf(sig);
                if (index !== -1)
                    state.unprojected = state.unprojected.delete(index);
            }
        },
        nextAtom (state, action: PayloadAction<string>) {
            const sig = action.payload;
            const cur = state.projections.get(sig);
            const atm = state.atoms.get(sig);
            if (cur && atm) {
                const idx = atm.indexOf(cur);
                const nxt = idx + 1;
                if (idx !== -1 && nxt < atm.length) {
                    state.projections = state.projections.set(sig, atm[nxt]);
                }
            }
        },
        previousAtom (state, action: PayloadAction<string>) {
            const sig = action.payload;
            const cur = state.projections.get(sig);
            const atm = state.atoms.get(sig);
            if (cur && atm) {
                const idx = atm.indexOf(cur);
                const nxt = idx - 1;
                if (idx !== -1 && nxt >= 0) {
                    state.projections = state.projections.set(sig, atm[nxt]);
                }
            }
        },
        removeLibrary (state, action: PayloadAction<string>) {
            const index = state.libraries.indexOf(action.payload);
            if (index > -1) {
                state.libraries = state.libraries.delete(index);
            }
        },
        removeProjection (state, action: PayloadAction<string>) {
            const sig = action.payload;
            state.projections = state.projections.delete(sig);
            state.unprojected = state.unprojected.push(sig).sort(alphabetical);
        },
        setProjection (state, action: PayloadAction<{sig: string, atom: string}>) {
            const { sig, atom } = action.payload;
            if (state.projections.has(sig) && state.projections.get(sig) !== atom) {
                state.projections = state.projections.set(sig, atom);
            }
        },
        setScript (state, action: PayloadAction<string>) {
            state.script = action.payload;
        },
        setSize (state, action: PayloadAction<[number|null, number|null]>) {
            state.width = action.payload[0];
            state.height = action.payload[1];
        },
        setStage (state, action: PayloadAction<'canvas'|'svg'|'div'>) {
            if (action.payload !== state.stage) {
                state.stage = action.payload;
                state.status = ScriptStatus.PENDING;
            }
        },
        setStatus (state, action: PayloadAction<ScriptStatus>) {
            if (state.status !== action.payload)
                state.status = action.payload;
        },
        setValue (state, action: PayloadAction<string>) {
            state.script = action.payload;
        },
        toggleAutorun (state) {
            state.autorun = !state.autorun;
        },
        toggleCollapseInstanceVariables (state) {
            state.collapseInstanceVariables = !state.collapseInstanceVariables;
        },
        toggleCollapseLibraries (state) {
            state.collapseLibraries = !state.collapseLibraries;
        },
        toggleCollapseStageVariables (state) {
            state.collapseStageVariables = !state.collapseStageVariables;
        }
    },
    extraReducers: builder => {
        builder.addCase(setInstance, (state, action: PayloadAction<AlloyInstance | null>) => {

            const xml = action.payload ? action.payload.xml() : null;
            if (xml) {

                const instance = new ProxyInstance(xml.source());
                const univ = instance.univ();
                const signatures = univ ? univ.subSignatures() : [];

                state.instance = instance;

                // Keep any existing projections
                state.projections = Map<string, string>().withMutations(map => {
                    signatures.forEach(sig => {
                        const currentAtom = state.projections.get(sig.id());
                        if (currentAtom && sig.atoms(true).find(atom => atom.id() === currentAtom)) {
                            map.set(sig.id(), currentAtom);
                        }
                    });
                });

                // Create the list of unprojected signatures
                state.unprojected = List<string>().withMutations(list => {
                    signatures.forEach(sig => {
                        const id = sig.id();
                        const count = sig.atoms(true).length;
                        if (count && !state.projections.has(id))
                            list.push(id);
                    });
                });

                // Extract atoms
                state.atoms = Map(signatures.map(sig => [
                    sig.id(),
                    sig.atoms(true).map(atom => atom.id())
                ]));


            } else {
                state.atoms = Map();
                state.instance = null;
                state.projections = Map();
                state.unprojected = List();
            }

        });
    }
});

function alphabetical (a: string, b: string): number {
    return a.localeCompare(b);
}

export const {
    addLibrary,
    addProjection,
    removeLibrary,
    nextAtom,
    previousAtom,
    removeProjection,
    setProjection,
    setScript,
    setSize,
    setStage,
    setStatus,
    setValue,
    toggleCollapseInstanceVariables,
    toggleCollapseLibraries,
    toggleCollapseStageVariables
} = scriptSlice.actions;
export default scriptSlice.reducer;

