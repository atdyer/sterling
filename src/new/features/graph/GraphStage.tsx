import { Node, NodeStyle } from '@atdyer/graph-js';
import { cloneLabelStyle } from '@atdyer/graph-js/dist/styles/LabelStyle';
import { cloneShapeStyle } from '@atdyer/graph-js/dist/styles/ShapeStyle';
import { AlloyAtom, AlloySignature } from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';

// Map redux state to graph settings props
const mapState = (state: RootState) => ({
    instance: state.alloySlice.instance,
    settings: state.graphSlice
});

// Create connector
const connector = connect(mapState);

// Create props for things from redux
type GraphStageProps = ConnectedProps<typeof connector>;

// The graph stage component
class GraphStage extends React.Component<GraphStageProps> {

    private _ref: HTMLCanvasElement | null;

    constructor (props: GraphStageProps) {

        super(props);

        this._ref = null;

    }

    componentDidMount (): void {

        this.props.settings.graph.canvas(this._ref!);

    }

    componentWillUnmount (): void {

    }

    componentDidUpdate (): void {

        const instance = this.props.instance;
        const graph = this.props.settings.graph;
        const shapes = this.props.settings.shapes;
        const nodeLabels = this.props.settings.nodeLabels;

        if (instance) {

            // Get the nodes
            const oldnodes = graph.nodes();
            const newnodes = mergeAtomsToNodes(oldnodes, instance.atoms());
            graph.nodes(newnodes);

            // Create the node styles
            const univ = instance.signatures().find(sig => sig.id() === 'univ');

            if (univ) {

                const populate = (sig: AlloySignature): NodeStyle => {
                    const children = sig.subTypes().map(populate);
                    const shape = shapes.get(sig.id());
                    const label = nodeLabels.get(sig.id());
                    return {
                        nodes: sig.atoms().map(atom => atom.name()),
                        shape: shape ? cloneShapeStyle(shape) : undefined,
                        label: label ? cloneLabelStyle(label) : undefined,
                        children
                    }
                };

                const styletree = populate(univ);
                if (!styletree.shape) styletree.shape = {};
                if (!styletree.shape.type) styletree.shape.type = 'circle';

                graph.nodeStyles([styletree]);

            }

        } else {
            graph.nodes([]);
        }

        graph.update();

    }

    render (): React.ReactNode {

        return (
            <canvas className={'graph'} ref={ref => this._ref = ref}/>
        );

    }

}

function mergeAtomsToNodes (nodes: Node[], atoms: AlloyAtom[]): Node[] {

    return atoms.map(atom => {
        const id = atom.name();
        const existing = nodes.find(node => node.id === id);
        if (existing) {
            return existing;
        } else {
            return {
                id: id,
                x: 0,
                y: 0
            }
        }
    });

}

export default connector(GraphStage);
