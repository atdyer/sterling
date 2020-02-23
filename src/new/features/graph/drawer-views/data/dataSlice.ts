import { Edge } from '@atdyer/graph-js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    AlloyAtom,
    AlloyField,
    AlloyInstance,
    AlloySkolem,
    AlloyTuple
} from 'alloy-ts';
import { List, Map } from 'immutable';
import { isDefined } from 'ts-is-present';
import { setInstance } from '../../../../alloy/alloySlice'

export interface DataState {
    atoms: Map<string, string[]>
    collapseExpressions: boolean
    collapseProjections: boolean
    collapseRelations: boolean
    collapseSignatures: boolean
    edges: Edge[]
    fields: List<AlloyField>
    projections: Map<string, string>
    skolems: List<AlloySkolem>
    unprojected: List<string>
}

const initialState: DataState = {
    atoms: Map(),
    collapseExpressions: false,
    collapseProjections: false,
    collapseRelations: false,
    collapseSignatures: false,
    edges: [],
    fields: List(),
    projections: Map(),
    skolems: List(),
    unprojected: List()
};

const dataSlice = createSlice({
    name: 'graphdata',
    initialState: initialState,
    reducers: {
        addProjection (state, action: PayloadAction<string>) {
            const sig = action.payload;
            const atoms = state.atoms.get(sig);
            if (atoms && atoms.length) {
                const atom = atoms[0];
                state.projections = state.projections.set(sig, atom);
                const index = state.unprojected.indexOf(sig);
                if (index !== -1)
                    state.unprojected = state.unprojected.delete(index);
                state.edges = buildEdges(
                    [...state.fields.toArray(), ...state.skolems.toArray()],
                    state.projections.toMap()
                );
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
                    state.edges = buildEdges(
                        [...state.fields.toArray(), ...state.skolems.toArray()],
                        state.projections.toMap()
                    );
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
                    state.edges = buildEdges(
                        [...state.fields.toArray(), ...state.skolems.toArray()],
                        state.projections.toMap()
                    );
                }
            }
        },
        removeProjection (state, action: PayloadAction<string>) {
            const sig = action.payload;
            state.projections = state.projections.delete(sig);
            state.unprojected = state.unprojected.push(sig).sort(alphabetical);
            state.edges = buildEdges(
                [...state.fields.toArray(), ...state.skolems.toArray()],
                state.projections.toMap()
            );
        },
        setProjection (state, action: PayloadAction<{sig: string, atom: string}>) {
            const { sig, atom } = action.payload;
            if (state.projections.has(sig) && state.projections.get(sig) !== atom) {
                state.projections = state.projections.set(sig, atom);
                state.edges = buildEdges(
                    [...state.fields.toArray(), ...state.skolems.toArray()],
                    state.projections.toMap()
                );
            }
        },
        toggleCollapseExpressions (state) {
            state.collapseExpressions = !state.collapseExpressions;
        },
        toggleCollapseProjections (state) {
            state.collapseProjections = !state.collapseProjections
        },
        toggleCollapseRelations (state) {
            state.collapseRelations = !state.collapseRelations;
        },
        toggleCollapseSignatures (state) {
            state.collapseSignatures = !state.collapseSignatures;
        }
    },
    extraReducers: build =>
        build.addCase(setInstance, (state, action: PayloadAction<AlloyInstance | null>) => {

            const instance = action.payload;

            if (instance) {

                const univ = instance.signatures().find(sig => sig.id() === 'univ');

                if (univ) {

                    const signatures = univ.subTypes();

                    // Keep any existing projections
                    state.projections = Map<string, string>().withMutations(map => {
                        signatures.forEach(sig => {
                            const atom = state.projections.get(sig.id());
                            if (atom && sig.findAtom(atom)) {
                                map.set(sig.id(), atom);
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
                    }).sort(alphabetical);

                    // Extract atoms
                    state.atoms = Map(signatures.map(sig => [
                            sig.id(),
                            sig.atoms(true).map(atom => atom.name())
                        ]));

                    // Extract fields
                    state.fields = List(instance.fields());

                    // Extract skolems of arity higher than 1
                    state.skolems = List(instance.skolems().filter(s => s.arity() > 1));

                    // Build edges
                    state.edges = buildEdges(
                        [...state.fields.toArray(), ...state.skolems.toArray()],
                        state.projections.toMap()
                    );

                } else {

                    state.atoms = Map();
                    state.edges = [];
                    state.fields = List();
                    state.projections = Map();
                    state.unprojected = List();

                }

            } else {

                state.atoms = Map();
                state.edges = [];
                state.fields = List();
                state.projections = Map();
                state.unprojected = List();

            }

        })
});

function alphabetical (a: string, b: string): number {
    return a.localeCompare(b);
}

function buildEdges (items: (AlloyField | AlloySkolem)[], projections: Map<string, string>): Edge[] {

    return items.map(item => {

        const sigs = item.types().map(sig => sig.id());
        const prjatoms = sigs.map(type => projections.get(type));
        const hasprj = prjatoms.some(item => item !== undefined);

        if (!hasprj) {
            return item.tuples()
                .map(tuple => tupleToEdge(tuple, item.id(), item.name()))
                .filter(isDefined)
        } else {
            return item.tuples()
                .map(tuple => projectedTupleToEdge(tuple, item.id(), item.name(), prjatoms))
                .filter(isDefined)
        }

    }).reduce((acc, cur) => acc.concat(...cur), []);
}

function projectedTupleToEdge (tuple: AlloyTuple, group: string, label: string, atoms: (string | undefined)[]): Edge | undefined {
    const keep = tuple.atoms().every((atom, index) => {
        return atoms[index] === undefined || atoms[index] === atom.name();
    });
    if (keep) {
        const projected: AlloyAtom[] = tuple.atoms().filter((atom, index) => {
            return atoms[index] === undefined;
        });
        if (projected.length > 1) {
            const source = projected[0];
            const target = projected[projected.length - 1];
            const middle = projected.slice(1, projected.length - 1);
            return {
                source: source.name(),
                target: target.name(),
                group: group,
                label: label + (
                    middle.length
                        ? `[${middle.join(',')}]`
                        : ''
                )
            }
        }
    }
}

function tupleToEdge (tuple: AlloyTuple, group: string, label: string): Edge | undefined {
    const atoms = tuple.atoms();
    if (atoms.length > 1) {
        const source = atoms[0];
        const target = atoms[atoms.length - 1];
        const middle = atoms.slice(1, atoms.length - 1);
        return {
            source: source.name(),
            target: target.name(),
            group: group,
            label: label + (
                middle.length
                    ? `[${middle.join(',')}]`
                    : ''
            )
        }
    }
}

export const {
    addProjection,
    nextAtom,
    previousAtom,
    removeProjection,
    setProjection,
    toggleCollapseExpressions,
    toggleCollapseProjections,
    toggleCollapseRelations,
    toggleCollapseSignatures
} = dataSlice.actions;
export default dataSlice.reducer;
