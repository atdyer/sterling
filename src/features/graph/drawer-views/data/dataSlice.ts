import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlloyInstance } from 'alloy-ts';
import { List, Map } from 'immutable';
import { setInstance } from '../../../../sterling/sterlingSlice'

export interface DataState {
    asAttribute: Map<string, boolean>
    atoms: Map<string, string[]>
    collapseProjections: boolean
    projections: Map<string, string>
    unprojected: List<string>
}

const initialState: DataState = {
    asAttribute: Map(),
    atoms: Map(),
    collapseProjections: false,
    projections: Map(),
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
        toggleAsAttribute (state, action: PayloadAction<string|null>) {
            const field = action.payload;
            if (field) {
                const curr = state.asAttribute.get(field);
                state.asAttribute = state.asAttribute.set(field, !curr);
            }
        },
        toggleCollapseProjections (state) {
            state.collapseProjections = !state.collapseProjections
        },
    },
    extraReducers: build =>
        build.addCase(setInstance, (state, action: PayloadAction<AlloyInstance | null>) => {

            const instance = action.payload;

            if (instance) {

                const univ = instance.signatures().find(sig => sig.id() === 'univ');

                if (univ) {

                    const signatures = univ.subTypes();
                    const fields = instance.fields();
                    const skolems = instance.skolems().filter(s => s.arity() > 1);
                    const both = [...fields, ...skolems];

                    // Keep any existing projections
                    state.projections = Map<string, string>().withMutations(map => {
                        signatures.forEach(sig => {
                            const atom = state.projections.get(sig.id());
                            if (atom && sig.findAtom(atom)) {
                                map.set(sig.id(), atom);
                            }
                        });
                    });

                    // Keep any fields set to display as attributes
                    state.asAttribute = Map(both.map(item => {
                        const id = item.id();
                        return state.asAttribute.has(id)
                            ? [id, state.asAttribute.get(id)!]
                            : [id, false];
                    }));

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


                } else {

                    state.asAttribute = Map();
                    state.atoms = Map();
                    state.projections = Map();
                    state.unprojected = List();

                }

            } else {

                state.atoms = Map();
                state.projections = Map();
                state.unprojected = List();

            }

        })
});

function alphabetical (a: string, b: string): number {
    return a.localeCompare(b);
}

export const {
    addProjection,
    nextAtom,
    previousAtom,
    removeProjection,
    setProjection,
    toggleAsAttribute,
    toggleCollapseProjections
} = dataSlice.actions;
export default dataSlice.reducer;
