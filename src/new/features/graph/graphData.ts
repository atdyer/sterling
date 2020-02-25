import { Edge, Node } from '@atdyer/graph-js';
import {
    AlloyAtom,
    AlloyField,
    AlloyInstance,
    AlloySignature,
    AlloySkolem,
    AlloyTuple
} from 'alloy-ts';
import { Map, Set } from 'immutable';
import { isDefined } from 'ts-is-present';

function generateGraph (
    instance: AlloyInstance,
    existingNodes: Node[],
    projections: Map<string, string>,
    attributes: Map<string, boolean>,
    hideDisconnected: Map<string, boolean>
): [Node[], Edge[]] {

    /**
     * Need instance, existing nodes, projections, fields that are rendered as attributes, and
     * whether or not to render disconnected nodes for each signature.
     * With these five things we can build the set of nodes (updating any existing ones):
     * {
     *     id: atom name
     *     x: 0
     *     y: 0
     *     labels: [
     *         ...skolems,
     *         ...fields as attributes
     *     ]
     * }
     *
     * and the set of edges:
     * {
     *     source: source node (after projections)
     *     target: target node (after projections)
     *     group: field or skolem name
     *     label: field or skolem name [any atom names that fall betweet source and target]
     * }
     */


    // Create a map of Signature objects to their projected Atom objects and a
    // set of all projected atoms
    const _projections: Map<AlloySignature, AlloyAtom|undefined> = Map(instance.signatures().map(sig => {
        const id = sig.id();
        return projections.has(id)
            ? [sig, getAtom(projections.get(id)!)]
            : [sig, undefined];
    }));

    // Project every tuple of every field, remove empty tuples and empty fields
    const fields = Map<AlloyField, AlloyTuple[]>(instance.fields().map(field => {
        return [
            field,
            field.tuples().map(project).filter(isDefined).filter(hasAtoms)
        ];
    })).filter(tuples => tuples.length > 0);

    // Project every tuple of every skolem, remove empty tuples and empty skolems
    const skolems = Map<AlloySkolem, AlloyTuple[]>(instance.skolems().map(skolem => {
        return [
            skolem,
            skolem.tuples().map(project).filter(isDefined).filter(hasAtoms)
        ];
    })).filter(tuples => tuples.length > 0);

    // Check for anything wonky happening during projection. Within a single
    // field or skolem, the arity of every tuple should be identical and positive
    // const fieldsOK = fields.every(tuplesSameArity);
    // const skolemsOK = skolems.every(tuplesSameArity);
    // if (!fieldsOK || !skolemsOK) {
    //     console.error('OH GOD NO!!!!');
    // } else {
    //     console.log('HOORAY!');
    // }

    // Separate fields into those that will be edges and those that will be labels.
    // Fields that will be labels must have an arity greater than 1 (otherwise the label would be empty)
    const edgeFields = fields.filter((tuples, field) => !isAttribute(field) && tuples[0].arity() > 1);
    const labelFields = fields.filter((tuples, field) => isAttribute(field) || tuples[0].arity() === 1);

    // Separate skolems into those that will be edges and those that will be labels
    const edgeSkolems = skolems.filter(tuples => tuples[0].arity() > 1);
    const labelSkolems = skolems.filter(tuples => tuples[0].arity() === 1);

    // Create an empty list for edges
    const edges: Edge[] = [];

    // Create all edges, building a set of connected atoms
    const connected = Set<AlloyAtom>().withMutations(connected => {
        edgeFields.forEach((tuples, field) => {
            tuples.forEach(tuple => buildEdge(field, tuple));
        });
        edgeSkolems.forEach((tuples, skolem) => {
            tuples.forEach(tuple => buildEdge(skolem, tuple));
        });
        function buildEdge (item: AlloyField | AlloySkolem, tuple: AlloyTuple) {
            const atoms = tuple.atoms();
            const source = atoms[0];
            const target = atoms[atoms.length - 1];
            const middle = atoms.slice(1, atoms.length - 1);
            const label = item.name() + (middle.length ? ` [${middle.join(', ')}]` : '');
            connected.add(source);
            connected.add(target);
            edges.push({
                source: source.name(),
                target: target.name(),
                group: item.id(),
                label: label
            });
        }
    });

    // Create the labels for each atom
    const labelMap = Map<AlloyAtom, string[]>()
        .withMutations(map => {
            labelFields.forEach(addLabel);
            labelSkolems.forEach(addLabel);

            function addLabel (tuples: AlloyTuple[], item: AlloyField|AlloySkolem) {

                // Create a map of atoms to labels for this particular field/skolem
                const labels = Map<AlloyAtom, string[]>()
                    .withMutations(labels => {
                        tuples.forEach(tuple => {
                            const atoms = tuple.atoms();
                            const target = atoms[0];
                            const label = atoms.slice(1).map(atom => atom.name()).join('->');
                            if (!labels.has(target)) labels.set(target, []);
                            if (label.length) labels.get(target)!.push(label);
                        });
                    });

                // Combine all labels for this particular field/skolem and add
                // them to the appropriate atom
                labels.forEach((labels, atom) => {
                    const joined = labels.length ? `: ${labels.join(', ')}` : '';
                    if (!map.has(atom)) map.set(atom, []);
                    map.get(atom)!.push(`${item.name()}${joined}`);
                });

            }

        });

    // Debug print
    // labelMap.forEach((labels, atom) => console.log(atom.name(), labels));

    // Create nodes
    const nodes: Node[] = instance.atoms().map(atom => {

        // First determine if the atom should be visible. It's visible if it's
        // connected or if its type is not explicitly hidden.
        const type = atom.type();
        const visible = connected.has(atom) || !hideDisconnected.get(type.id());

        if (visible) {

            // If it's visible, look for an existing node, otherwise create a new one
            const node = existingNodes.find(node => node.id === atom.name()) || {
                id: atom.name(),
                x: 0,
                y: 0
            };

            // Get any labels associated with this atom
            node.labels = labelMap.get(atom);

            return node;

        }

        return undefined;

    }).filter(isDefined);

    return [nodes, edges];

    /**
     * Find an atom in the instance provided to the generateGraph function
     * @param atom
     */
    function getAtom (atom: string): AlloyAtom | undefined {
        return instance.atoms().find(a => a.name() === atom);
    }

    /**
     * Returns true if a tuple has atoms
     * @param tuple
     */
    function hasAtoms (tuple: AlloyTuple): boolean {
        return tuple.arity() > 0;
    }

    /**
     * Returns true if the item is to be displayed as an attribute
     * @param item
     */
    function isAttribute (item: AlloyField | AlloySkolem): boolean {
        return !!attributes.get(item.id());
    }

    /**
     * Project a tuple using the projections provided to the generateGraph function.
     * A tuple that has no types with projections will remain unchanged. A tuple
     * that has projected types but any atoms of those types are not the projected
     * atom will be removed completely (ie. return undefined). A tuple that has
     * projected types will have a projection if all of the atoms are of their
     * respective projected types.
     * @param tuple
     */
    function project (tuple: AlloyTuple): AlloyTuple | undefined {

        const projectedAtoms = tuple
            .types()
            .map(projectable)
            .map(sig => _projections.get(sig));

        if (projectedAtoms.some(isDefined)) {

            const atoms = tuple.atoms();
            const keep = atoms.every((atom, index) => projectedAtoms[index] === undefined || projectedAtoms[index] === atom);

            if (keep) {

                return new AlloyTuple(tuple.id(), atoms.filter((atom, index) => {
                    return projectedAtoms[index] === undefined;
                }));

            }

        } else {

            return tuple;

        }

    }

    /**
     * Only top level signatures (those that are direct descendants of univ)
     * can be projected. This function return the top level type of any signature
     * in the instance.
     * @param signature
     */
    function projectable (signature: AlloySignature): AlloySignature {
        return signature.typeHierarchy()[1];
    }

    /**
     * Returns true if there are tuples in the list and they are all the same arity
     * @param tuples
     */
    // function tuplesSameArity (tuples: AlloyTuple[]): boolean {
    //     if (!tuples.length) return false;
    //     const arity = tuples[0].arity();
    //     return tuples.every(tuple => tuple.arity() === arity);
    // }

}

export {
    generateGraph
}
