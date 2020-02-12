import { AlloyInstance } from 'alloy-ts';
import cytoscape from 'cytoscape';
import React from 'react';
import { ISterlingViewProps } from '../../sterling/SterlingTypes';

interface IGraphViewProps extends ISterlingViewProps {

}

class GraphView extends React.Component<IGraphViewProps> {

    private _ref: HTMLDivElement | null;
    private _cy: cytoscape.Core | null;

    constructor (props: IGraphViewProps) {

        super(props);
        this._ref = null;
        this._cy = null;

    }

    componentDidMount (): void {

        this._render();

    }

    render (): React.ReactNode {

        const props = this.props;
        const visible = props.visible;
        const stageStyle = {display: visible ? 'block' : 'none'};

        return <div
            ref={ref => this._ref = ref}
            style={stageStyle}/>;

    }

    _render (): void {

        const instance: AlloyInstance = this.props.data;

        if (instance) {

            const tuples = instance.tuples();
            const usedsigs = new Set();
            const usedatoms = new Set();
            tuples.forEach(tuple => tuple.atoms().forEach(atom => {
                usedatoms.add(atom.id());
                usedsigs.add(atom.type().id());
            }));

            const atoms = instance.atoms()
                .filter(atom => usedatoms.has(atom.id()));

            const sigs = instance.signatures()
                .filter(sig => usedsigs.has(sig.id()));

            const atomelements: cytoscape.ElementDefinition[] = atoms.map(atom => {
                return {
                    group: 'nodes',
                    data: {
                        id: atom.id(),
                        name: atom.name(),
                        parent: atom.type().id()
                    }
                }
            });

            const sigelements: cytoscape.ElementDefinition[] = sigs.map(sig => {
                return {
                    group: 'nodes',
                    data: {
                        id: sig.id(),
                        name: sig.name()
                    }
                }
            });

            const tupelements: cytoscape.ElementDefinition[] = tuples.map(tup => {
                const atoms = tup.atoms();
                return {
                    group: 'edges',
                    data: {
                        id: tup.id(),
                        name: tup.name(),
                        source: atoms[0].id(),
                        target: atoms[atoms.length-1].id()
                    }
                }
            });

            this._cy = cytoscape({
                container: this._ref!,
                style: [
                    {
                        selector: 'node',
                        style: {
                            'label': 'data(name)'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'label': 'data(name)',
                            'curve-style': 'bezier'
                        }
                    },
                    {
                        selector: 'edge[arrow]',
                        style: {
                            'target-arrow-shape': 'triangle'
                        }
                    }
                ],
                elements: [...sigelements, ...atomelements, ...tupelements],
                layout: {
                    name: 'cose',
                    animate: false
                }
            });

        }

    }

}

export default GraphView;
