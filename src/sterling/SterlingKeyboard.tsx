import React from 'react';
import { HotKeys } from 'react-hotkeys';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../rootReducer';
import { setMainView } from './sterlingSlice';
import { toggleAxesVisible, toggleGridVisible } from '../features/graph/drawer-views/graph-settings/graphSettingsSlice'

const keyMap = {
    TOGGLE_AXES: 'shift+a',
    TOGGLE_GRID: 'shift+g',
    VIEW_GRAPH: 'g',
    VIEW_SOURCE: 's',
    VIEW_TABLE: 't',
    ZOOM_TO_FIT: 'f',
    ZOOM_TO_HOME: 'h'
};

const mapState = (state: RootState) => ({
    ...state
});

const mapDispatch = {
    setMainView,
    toggleAxesVisible,
    toggleGridVisible
};

const connector = connect(mapState, mapDispatch);

type SterlingKeyboardProps = ConnectedProps<typeof connector>;

class SterlingKeyboard extends React.Component<SterlingKeyboardProps> {

    render (): React.ReactNode {

        return <HotKeys className={'sterling'} keyMap={keyMap} handlers={this._handlers()}>
            {this.props.children}
        </HotKeys>

    }

    private _handlers = (): {[key: string]: () => void} => {

        return {
            TOGGLE_AXES: () => {
                if (this.props.sterlingSlice.mainView === 'graph')
                    this.props.toggleAxesVisible();
            },
            TOGGLE_GRID: () => {
                if (this.props.sterlingSlice.mainView === 'graph')
                    this.props.toggleGridVisible();
            },
            VIEW_GRAPH: () => {
                this.props.setMainView('graph');
            },
            VIEW_SOURCE: () => {
                this.props.setMainView('source');
            },
            VIEW_TABLE: () => {
                this.props.setMainView('table');
            },
            ZOOM_TO_FIT: () => {
                if (this.props.sterlingSlice.mainView === 'graph')
                    this.props.graphSlice.graphSlice.graph.zoomToFit();
            },
            ZOOM_TO_HOME: () => {
                if (this.props.sterlingSlice.mainView === 'graph')
                    this.props.graphSlice.graphSlice.graph.zoomToHome();
            }
        }

    }

}

export default connector(SterlingKeyboard);
