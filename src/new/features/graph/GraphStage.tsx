import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';

// Map redux state to graph settings props
const mapState = (state: RootState) => ({
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

        // this.props.settings.graph.canvas(null);

    }

    render (): React.ReactNode {

        return (
            <canvas className={'graph'} ref={ref => this._ref = ref}/>
        );

    }

}

export default connector(GraphStage);
