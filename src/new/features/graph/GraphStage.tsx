import {
    cloneLabelStyle,
    cloneShapeStyle,
    Edge,
    EdgeStyle,
    Node,
    NodeStyle
} from '@atdyer/graph-js';
import { NonIdealState } from '@blueprintjs/core';
import {
    AlloyAtom,
    AlloyField,
    AlloySignature,
    AlloySkolem,
    AlloyTuple
} from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { isDefined } from 'ts-is-present';
import { RootState } from '../../rootReducer';
import { Map } from 'immutable';
import { generateGraph } from './graphData';

const DEFAULT_EDGE_STYLES: EdgeStyle[] = [];

const DEFAULT_NODE_STYLES: NodeStyle[] = [{
    nodes: [],
    shape: { type: 'circle' }
}];

// Map redux state to graph settings props
const mapState = (state: RootState) => ({
    asAttribute: state.graphSlice.dataSlice.asAttribute,
    description: state.sterlingSlice.welcomeDescription,
    edges: state.graphSlice.dataSlice.edges,
    edgeLabels: state.graphSlice.edgeStylingSlice.labelStyles,
    graph: state.graphSlice.graphSlice.graph,
    hideDisconnected: state.graphSlice.nodeStylingSlice.hideDisconnected,
    instance: state.alloySlice.instance,
    nodeLabels: state.graphSlice.nodeStylingSlice.labels,
    links: state.graphSlice.edgeStylingSlice.linkStyles,
    projections: state.graphSlice.dataSlice.projections,
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
    private _nodes: Node[];

    constructor (props: GraphStageProps) {

        super(props);

        this._ref = React.createRef<HTMLCanvasElement>();
        this._nodes = [];

    }

    componentDidMount (): void {

        const canvas = this._ref.current;
        if (canvas) this.props.graph.canvas(canvas);

    }

    componentDidUpdate (): void {

        const props = this.props;
        const instance = props.instance;
        const graph = props.graph;
        const settings = props.settings;
        // const edges = props.edges;
        // const attrs = props.asAttribute;

        if (instance) {

            // TESTING
            const [nodes, edges] = generateGraph(
                instance,
                this._nodes,
                props.projections,
                props.asAttribute,
                props.hideDisconnected
            );

            this._nodes = nodes;

            // Merge old nodes with current nodes
            // this._nodes = mergeAtomsToNodes(this._nodes, instance.atoms(), attrs);

            // const nodes = props.hideDisconnected
            //     ? this._buildConnectedNodes(edges)
            //     : this._nodes;

            // Set the nodes and edges
            graph.nodes(nodes);
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

    private _buildConnectedNodes (edges: Edge[]): Node[] {

        const props = this.props;
        const instance = props.instance;

        if (!instance) return [];

        // Create set of atoms that are eligible to be disconnected
        const removeable = instance.atoms().map(atom => {
            const type = atom.type().id();
            const isSkolem = atom.skolems().some(skolem => skolem.arity() === 1);
            return props.hideDisconnected.get(type) && !isSkolem
                ? atom.name()
                : undefined
        }).filter(isDefined);

        return removeDisconnected(this._nodes, edges, new Set(removeable));

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

function mergeAtomsToNodes (nodes: Node[], atoms: AlloyAtom[], attrs: Map<string, boolean>): Node[] {

    return atoms.map(atom => {

        const id = atom.name();
        const existing = nodes.find(node => node.id === id);
        const labels = atom.skolems().map(skolem => skolem.id());

        const fields = atom.type().fields();
        fields.forEach(field => {
            const id = field.id();
            const asattr = !!attrs.get(id);
            if (asattr) {
                // This field is to be displayed as an attribute, now get all
                // tuples that start with this atom and add a label
                field.tuples()
                    .filter(tuple => tuple.atoms()[0] === atom)
                    .forEach(tuple => {
                        const rest = tuple.atoms().slice(1);
                        if (rest.length) {
                            labels.push(`${field.name()}: ${rest.map(atom => atom.name()).join('->')}`);
                        }
                    })
                // labels.push(`${id}: ${}`)
            }
        });

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

function project (tuple: AlloyTuple, projections: Map<string, string>): AlloyTuple {
    return new AlloyTuple(tuple.id(), tuple.atoms());
}

function removeDisconnected (nodes: Node[], edges: Edge[], removeable: Set<string>): Node[] {

    const connected = new Set<string>();

    edges.forEach(edge => {
        connected.add(edge.source);
        connected.add(edge.target);
    });

    return nodes.filter(node =>
        connected.has(node.id)
        || !removeable.has(node.id));

}

export default connector(GraphStage);
