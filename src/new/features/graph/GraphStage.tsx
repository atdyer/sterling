import {
    cloneLabelStyle,
    cloneShapeStyle,
    EdgeStyle,
    Node,
    NodeStyle
} from '@atdyer/graph-js';
import { NonIdealState } from '@blueprintjs/core';
import { AlloyAtom, AlloyField, AlloySignature, AlloySkolem } from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';

const DEFAULT_EDGE_STYLES: EdgeStyle[] = [];

const DEFAULT_NODE_STYLES: NodeStyle[] = [{
    nodes: [],
    shape: { type: 'circle' }
}];

// Map redux state to graph settings props
const mapState = (state: RootState) => ({
    description: state.sterlingSlice.welcomeDescription,
    edges: state.graphSlice.dataSlice.edges,
    edgeLabels: state.graphSlice.edgeStylingSlice.labelStyles,
    graph: state.graphSlice.graphSlice.graph,
    instance: state.alloySlice.instance,
    nodeLabels: state.graphSlice.nodeStylingSlice.labels,
    links: state.graphSlice.edgeStylingSlice.linkStyles,
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
        const settings = this.props.settings;
        const edges = this.props.edges;

        if (instance) {

            // Set the nodes and edges
            const oldnodes = graph.nodes();
            const newnodes = mergeAtomsToNodes(oldnodes, instance.atoms());
            graph.nodes(newnodes);
            graph.edges(edges);

            // Create the styles
            graph.nodeStyles(this._buildNodeStyles());
            graph.edgeStyles(this._buildEdgeStyles());

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

    private _buildEdgeStyles (): EdgeStyle[] {

        const instance = this.props.instance;
        const links = this.props.links;
        const labels = this.props.edgeLabels;

        if (!instance) return DEFAULT_EDGE_STYLES;

        const fields = instance.fields();
        const skolems = instance.skolems().filter(s => s.arity() > 1);

        const toStyle = (item: AlloyField | AlloySkolem): EdgeStyle => {
            const id = item.id();
            return {
                groups: [id],
                link: links.get(id),
                label: labels.get(id)
            }
        };

        const fieldStyle: EdgeStyle = {
            groups: [],
            link: links.get('Fields'),
            label: labels.get('Fields'),
            children: fields.map(toStyle)
        };

        const skolemStyle: EdgeStyle = {
            groups: [],
            link: links.get('Skolems'),
            label: labels.get('Skolems'),
            children: skolems.map(toStyle)
        };

        return [fieldStyle, skolemStyle];

    }

    private _buildNodeStyles (): NodeStyle[] {

        const instance = this.props.instance;
        const shapes = this.props.shapes;
        const labels = this.props.nodeLabels;

        if (!instance) return DEFAULT_NODE_STYLES;

        const univ = instance.signatures().find(sig => sig.id() === 'univ');

        if (!univ) return DEFAULT_NODE_STYLES;

        const populate = (sig: AlloySignature): NodeStyle => {

            const children = sig.subTypes().map(populate);
            const shape = shapes.get(sig.id());
            const label = labels.get(sig.id());

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

        return [styletree];

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
