import { CircleLayout, Edge, Graph, Node } from '@atdyer/graph-js';
import { AlloyInstance } from 'alloy-ts';
import React from 'react';
import SplitPane from 'react-split-pane';
import { ISterlingViewProps } from '../../sterling/SterlingTypes';
import { Evaluator } from '../../new/evaluator/Evaluator';
import GraphViewSidebar from './GraphViewSidebar';
import GraphViewStage from './GraphViewStage';

export interface IGraphViewProps extends ISterlingViewProps {
    data: AlloyInstance | null
}

export interface IGraphViewState {
    collapseSidebar: boolean
    evaluator: Evaluator
    graph: Graph
    sidebarView: 'settings' | 'evaluator'
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
            collapseSidebar: false,
            evaluator: new Evaluator(props.connection),
            graph: graph,
            sidebarView: 'settings'
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

        if (!visible) return null;

        const sidebar = (
            <GraphViewSidebar
                {...state}
                onRequestSidebarView={this._onRequestSidebarView}
                onToggleCollapseSidebar={this._onToggleCollapseSidebar}
            />
        );

        const stage = (
            <GraphViewStage
                {...state}
                visible={visible}/>
        );

        return (
            state.collapseSidebar
                ? (<>{sidebar}{stage}</>)
                : <SplitPane split={'vertical'}
                             defaultSize={350}
                             minSize={300}
                             maxSize={550}
                             onChange={this._onResizeSidebar}
                             onDragFinished={this._onResizeSidebar}>
                    {sidebar}
                    {stage}
                </SplitPane>
        );

    }

    private _onResizeSidebar = (): void => {
        if (this.state.graph) {
            this.state.graph.resize();
        }
    };

    private _onRequestSidebarView = (view: 'settings' | 'evaluator'): void => {
        this.setState({
            sidebarView: view
        });
    };

    private _onToggleCollapseSidebar = (): void => {
        const curr = this.state.collapseSidebar;
        this.setState({collapseSidebar: !curr});
    }

}

export default GraphView;
