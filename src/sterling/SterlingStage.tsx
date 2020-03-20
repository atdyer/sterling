import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import GraphStage from '../features/graph/GraphStage';
import ScriptStage from '../features/script/ScriptStage';
import SourceStage from '../features/source/SourceStage';
import TableStage from '../features/table/TableStage';
import { RootState } from '../rootReducer';

const mapState = (state: RootState) => ({
    view: state.sterlingSlice.mainView
});

const connector = connect(mapState);

type SterlingStageProps = ConnectedProps<typeof connector>;

class SterlingStage extends React.Component<SterlingStageProps> {

    render (): React.ReactNode {

        const view = this.props.view;

        return (
            <div className={'stage'}>
                {
                    view === 'table' ? <TableStage/> :
                    view === 'graph' ? <GraphStage/> :
                    view === 'script' ? <ScriptStage/> :
                    view === 'source' ? <SourceStage/> :
                    null
                }
            </div>
        );

    }

}

export default connector(SterlingStage);
