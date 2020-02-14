import React from 'react';
import AlloySidebar
    from '../AlloySidebar';
import {
    HorizontalAlignment,
    LayoutDirection,
    SigFieldSkolem,
    TableSortFunction,
    TablesType
} from '../../sterling/SterlingTypes';
import DataSection from './sidebar-components/DataSection';
import LayoutSection from './sidebar-components/LayoutSection';
import TablesSection from './sidebar-components/TablesSection';
import { ITableViewState } from './TableView';


export interface ITableViewSidebarProps extends ITableViewState {
    onChooseLayoutDirection: (layout: LayoutDirection) => void
    onChooseSortingFunctions: (primary: TableSortFunction, secondary: TableSortFunction) => void
    onChooseTableAlignment: (align: HorizontalAlignment) => void
    onChooseTablesType: (type: TablesType) => void
    onItemsSelected: (items: SigFieldSkolem[]) => void
    onRequestSidebarView: (view: 'settings' | 'evaluator') => void
    onToggleBuiltin: () => void
    onToggleCollapseData: () => void
    onToggleCollapseLayout: () => void
    onToggleCollapseSidebar: () => void
    onToggleCollapseSkolem: () => void
    onToggleCollapseTables: () => void
    onToggleHighlightSkolems: () => void
    onToggleEmpty: () => void
    onToggleRemoveThis: () => void
}

class TableViewSidebar extends React.Component<ITableViewSidebarProps> {

    render (): React.ReactNode {

        const {
            onChooseLayoutDirection,
            onChooseSortingFunctions,
            onChooseTableAlignment,
            onChooseTablesType,
            onItemsSelected,
            onRequestSidebarView,
            onToggleBuiltin,
            onToggleCollapseData,
            onToggleCollapseLayout,
            onToggleCollapseSidebar,
            onToggleCollapseSkolem,
            onToggleCollapseTables,
            onToggleEmpty,
            onToggleHighlightSkolems,
            onToggleRemoveThis,
            ...viewState
        } = this.props;

        return (
            <AlloySidebar
                collapsed={viewState.collapseSidebar}
                evaluator={viewState.evaluator}
                onRequestSidebarView={onRequestSidebarView}
                onToggleCollapse={onToggleCollapseSidebar}
                title='Settings'
                view={this.props.sidebarView}>

                <TablesSection
                    {...viewState}
                    onChooseTablesType={onChooseTablesType}
                    onItemsSelected={onItemsSelected}
                    onToggleCollapse={onToggleCollapseTables}/>

                <DataSection
                    {...viewState}
                    onToggleBuiltin={onToggleBuiltin}
                    onToggleCollapse={onToggleCollapseData}
                    onToggleEmpty={onToggleEmpty}
                    onToggleHighlightSkolems={onToggleHighlightSkolems}
                    onToggleRemoveThis={onToggleRemoveThis}/>

                <LayoutSection
                    {...viewState}
                    onChooseLayoutDirection={onChooseLayoutDirection}
                    onChooseSortingFunctions={onChooseSortingFunctions}
                    onChooseTableAlignment={onChooseTableAlignment}
                    onToggleCollapse={onToggleCollapseLayout}/>

            </AlloySidebar>
        );

    }


}

export default TableViewSidebar;