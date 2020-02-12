import { CircleLayout, Edge, Graph, Node } from '@atdyer/graph-js';
import { AlloyInstance } from 'alloy-ts';
import React from 'react';
import { ISterlingViewProps } from '../../sterling/SterlingTypes';
import GraphViewSidebar from './GraphViewSidebar';
import GraphViewStage from './GraphViewStage';

export interface IGraphViewProps extends ISterlingViewProps {
    data: AlloyInstance | null
}

export interface IGraphViewState {
    graph: Graph
}

class GraphView extends React.Component<IGraphViewProps, IGraphViewState> {

    constructor (props: IGraphViewProps) {

        super(props);

        const graph = new Graph();
        const instance = props.data;

        if (instance) {

            const nodes: Node[] = instance
                .atoms()
                .map(atom => {
                    return {
                        id: atom.name(),
                        x: 0,
                        y: 0
                    }
                });

            const edges: Edge[] = instance
                .tuples()
                .map(tuple => {
                    const atoms = tuple.atoms();
                    const src = atoms[0];
                    const trg = atoms[atoms.length-1];
                    return {
                        source: src.name(),
                        target: trg.name()
                    }
                });

            graph
                .nodes(nodes)
                .edges(edges);

            const circle = new CircleLayout();
            circle.apply(graph);
            graph.update();

        }

        this.state = {
            graph: graph
        };

    }

    componentDidUpdate (prevProps: Readonly<IGraphViewProps>): void {

        if (prevProps.data !== this.props.data && this.props.data) {

            const instance = this.props.data;

            const nodes: Node[] = instance
                .atoms()
                .map(atom => {
                    return {
                        id: atom.name(),
                        x: 0,
                        y: 0
                    }
                });

            const edges: Edge[] = instance
                .tuples()
                .map(tuple => {
                    const atoms = tuple.atoms();
                    const src = atoms[0];
                    const trg = atoms[atoms.length-1];
                    return {
                        source: src.name(),
                        target: trg.name()
                    }
                });

            this.state.graph
                .nodes(nodes)
                .edges(edges)
                .update();

        }

    }

    render (): React.ReactNode {

        const state = this.state;
        const visible = this.props.visible;

        const sidebar = (
            <GraphViewSidebar {...state}/>
        );

        const stage = (
            <GraphViewStage
                {...state}
                visible={visible}/>
        );

        return (
            <>{sidebar}{stage}</>
        );

    }

}

export default GraphView;
