import React from 'react';
import AlloySidebar
    from '../AlloySidebar';
import { IGraphViewState } from './GraphView';

export interface IGraphViewSidebarProps extends IGraphViewState {
    onRequestSidebarView: (view: 'settings' | 'evaluator') => void
    onToggleCollapseSidebar: () => void
}

class GraphViewSidebar extends React.Component<IGraphViewSidebarProps> {

    render (): React.ReactNode {

        const {
            onRequestSidebarView,
            onToggleCollapseSidebar,
            ...viewState
        } = this.props;

        return <AlloySidebar
            collapsed={viewState.collapseSidebar}
            evaluator={viewState.evaluator}
            onRequestSidebarView={onRequestSidebarView}
            onToggleCollapse={onToggleCollapseSidebar}
            title={'Settings'}
            view={this.props.sidebarView}/>
    }

}

export default GraphViewSidebar;
