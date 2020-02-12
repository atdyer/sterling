import React from 'react';
import { IGraphViewState } from './GraphView';

export interface IGraphViewStageProps extends IGraphViewState {
    visible: boolean
}

class GraphViewStage extends React.Component<IGraphViewStageProps> {

    private _ref: HTMLCanvasElement | null;

    constructor (props: IGraphViewStageProps) {

        super(props);

        this._ref = null;

    }

    componentDidMount (): void {

        this.props
            .graph
            .canvas(this._ref!)
            .update();

    }

    componentDidUpdate(prevProps: Readonly<IGraphViewStageProps>): void {

        this.props.graph.update();

    }

    render (): React.ReactNode {

        const props = this.props;
        const visible = props.visible;
        const stageStyle = {display: visible ? 'block' : 'none'};

        return <canvas
            ref={ref => this._ref = ref}
            style={stageStyle}/>;

    }

}

export default GraphViewStage;
