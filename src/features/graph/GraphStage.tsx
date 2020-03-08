import {
    cloneLabelStyle,
    cloneShapeStyle, DagreLayout,
    EdgeStyle, Graph, Node,
    NodeStyle
} from '@atdyer/graph-js';
import { NonIdealState } from '@blueprintjs/core';
import {
    AlloyField,
    AlloyInstance,
    AlloySignature,
    AlloySkolem
} from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import { generateGraph } from './graphData';

const DEFAULT_EDGE_STYLES: EdgeStyle[] = [];

const DEFAULT_NODE_STYLES: NodeStyle[] = [{
    nodes: [],
    shape: { type: 'circle' }
}];

// Map redux state to graph settings props
const mapState = (state: RootState) => ({
    asAttribute: state.graphSlice.dataSlice.asAttribute,
    bundleFactor: state.graphSlice.graphSettingsSlice.bundleFactor,
    description: state.sterlingSlice.welcomeDescription,
    edgeLabelPlacement: state.graphSlice.graphSettingsSlice.edgeLabelPlacement,
    edgeLabels: state.graphSlice.edgeStylingSlice.labelStyles,
    graph: state.graphSlice.graphSlice.graph,
    hideDisconnected: state.graphSlice.nodeStylingSlice.hideDisconnected,
    instance: state.sterlingSlice.instance,
    links: state.graphSlice.edgeStylingSlice.linkStyles,
    nodeLabels: state.graphSlice.nodeStylingSlice.labels,
    projections: state.graphSlice.dataSlice.projections,
    shapes: state.graphSlice.nodeStylingSlice.shapes,
    settings: state.graphSlice.graphSettingsSlice,
    title: state.sterlingSlice.welcomeTitle
});

// Create connector
const connector = connect(mapState);

// Create props for things from redux
type GraphStageProps = ConnectedProps<typeof connector>;

// Create a node cache
const NODE_CACHE = new Map<string, Node>();

// The graph stage component
class GraphStage extends React.Component<GraphStageProps> {

    private _ref: React.RefObject<HTMLCanvasElement>;

    constructor (props: GraphStageProps) {

        super(props);

        this._ref = React.createRef<HTMLCanvasElement>();

    }

    componentDidMount (): void {

        const canvas = this._ref.current;
        const props = this.props;
        const graph = props.graph;
        const instance = props.instance;

        if (instance) this._update(graph, instance);
        if (canvas) this.props.graph.canvas(canvas);

        graph.update();

    }

    componentDidUpdate (prevProps: GraphStageProps): void {

        const props = this.props;
        const graph = props.graph;
        const instance = props.instance;
        const common = prevProps.instance && instance ? anyInCommon(prevProps.instance, instance) : false;

        if (instance) this._update(graph, instance);

        // Always update the layout for the Forge folks
        // const didProjectionsUpdate = prevProps.projections !== props.projections;
        //
        // if (!prevProps.instance || props.instance !== prevProps.instance || didProjectionsUpdate) {
        //     const dagre = new DagreLayout();
        //     dagre.apply(graph, {
        //         nodesep: 100,
        //         rankdir: 'BT',
        //         ranksep: 150
        //     });
        // }

        if (!common) {
            NODE_CACHE.clear();
        }

        if (!prevProps.instance || (instance && !common)) {
            const dagre = new DagreLayout();
            dagre.apply(graph, {
                nodesep: 100,
                rankdir: 'BT',
                ranksep: 150
            });
        }

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
        if (!styletree.shape.type) styletree.shape.type = 'rectangle';

        return [styletree];

    }

    private _update (graph: Graph, instance: AlloyInstance): void {

        const props = this.props;
        const settings = props.settings;

        if (instance) {

            const [nodes, edges] = generateGraph(
                instance,
                graph.nodes(),
                NODE_CACHE,
                props.projections,
                props.asAttribute,
                props.hideDisconnected
            );

            // Cache the nodes
            nodes.forEach(node => NODE_CACHE.set(node.id, node));

            // Set the nodes and edges
            graph.nodes(nodes);
            graph.edges(edges);
            graph.bundleFactor(props.bundleFactor);
            graph.edgeLabelPlacement(props.edgeLabelPlacement);

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

    }

}

function anyInCommon (a: AlloyInstance, b: AlloyInstance): boolean {
    const atoms = new Set();
    a.atoms().forEach(atom => {
        if (!atom.type().isBuiltin()) atoms.add(atom.id());
    });
    const batoms = b.atoms();
    for (let i=0; i<batoms.length; ++i) {
        const atom = batoms[i];
        if (!atom.type().isBuiltin() && atoms.has(atom.id())) return true;
    }
    return false;
}

export default connector(GraphStage);
