import {
    cloneLabelStyle,
    cloneShapeStyle,
    Node,
    NodeStyle
} from '@atdyer/graph-js';
import { NonIdealState } from '@blueprintjs/core';
import { AlloyAtom, AlloySignature } from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';

// Map redux state to graph settings props
const mapState = (state: RootState) => ({
    description: state.sterlingSlice.welcomeDescription,
    edges: state.graphSlice.dataSlice.edges,
    graph: state.graphSlice.graphSlice.graph,
    instance: state.alloySlice.instance,
    labels: state.graphSlice.nodeStylingSlice.labels,
    shapes: state.graphSlice.nodeStylingSlice.shapes,
    settings: state.graphSlice.graphSettingsSlice,
    title: state.sterlingSlice.welcomeTitle
});

// Create connector
const connector = connect(mapState);

// Create props for things from redux
type GraphStageProps = ConnectedProps<typeof connector>;

// The graph stage component
class GraphStage extends React.Component<GraphStageProps> {

    private _ref: React.RefObject<HTMLCanvasElement>;

    constructor (props: GraphStageProps) {

        super(props);

        this._ref = React.createRef<HTMLCanvasElement>();

    }

    componentDidMount (): void {

        const canvas = this._ref.current;
        if (canvas) this.props.graph.canvas(canvas);

    }

    componentDidUpdate (): void {

        const instance = this.props.instance;
        const graph = this.props.graph;
        const shapes = this.props.shapes;
        const nodeLabels = this.props.labels;
        const settings = this.props.settings;
        const edges = this.props.edges;

        if (instance) {

            // Get the nodes
            const oldnodes = graph.nodes();
            const newnodes = mergeAtomsToNodes(oldnodes, instance.atoms());
            graph.nodes(newnodes);
            graph.edges(edges);

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
            graph.edges([]);
        }

        graph.axesVisible(settings.axesVisible);
        graph.gridVisible(settings.gridVisible);

        const canvas = this._ref.current;
        if (canvas) this.props.graph.canvas(canvas);
        graph.update();

    }

    render (): React.ReactNode {

        const props = this.props;

        return this.props.instance
            ? <canvas className={'graph'} ref={this._ref}/>
            : <NonIdealState
                title={props.title}
                description={props.description}
                icon={'graph'}/>;

    }

}

function mergeAtomsToNodes (nodes: Node[], atoms: AlloyAtom[]): Node[] {

    return atoms.map(atom => {
        const id = atom.name();
        const existing = nodes.find(node => node.id === id);
        const labels = atom.skolems().map(skolem => skolem.id());
        if (existing) {
            existing.labels = labels.length ? labels : undefined;
            return existing;
        } else {
            return {
                id: id,
                labels: labels.length ? labels : undefined,
                x: 0,
                y: 0
            }
        }
    });

}

export default connector(GraphStage);
