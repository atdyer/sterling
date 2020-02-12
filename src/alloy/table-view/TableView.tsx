import { AlloyInstance, AlloySkolem, filtering, sorting } from 'alloy-ts';
import React from 'react';
import {
    AlloyNameFn,
    HorizontalAlignment, ISterlingViewProps,
    LayoutDirection,
    SigFieldSkolem,
    TableSortFunction,
    TablesType
} from '../../sterling/SterlingTypes';
import { nameFunction } from './TableUtil';
import TableViewSidebar from './TableViewSidebar';
import TableViewStage from './TableViewStage';

export interface ITableViewProps extends ISterlingViewProps {
    data: AlloyInstance | null,
    visible: boolean
}

export interface ITableViewState {
    collapseData: boolean,
    collapseLayout: boolean,
    collapseSidebar: boolean,
    collapseSkolem: boolean,
    collapseTables: boolean,
    highlightSkolems: boolean,
    items: SigFieldSkolem[],
    itemsSelected: SigFieldSkolem[],
    layoutDirection: LayoutDirection,
    nameFunction: AlloyNameFn,
    removeBuiltin: boolean,
    removeEmpty: boolean,
    removeThis: boolean,
    skolemColors: Map<AlloySkolem, string>,
    sortPrimary: TableSortFunction,
    sortSecondary: TableSortFunction,
    tableAlignment: HorizontalAlignment,
    tables: TablesType
}

class TableView extends React.Component<ITableViewProps, ITableViewState> {

    constructor (props: ITableViewProps) {

        super(props);

        const nF = nameFunction(true);
        const sH = props.data ? this._assignSkolemColors(props.data.skolems()) : new Map();

        this.state = {
            collapseData: false,
            collapseLayout: false,
            collapseSidebar: false,
            collapseSkolem: false,
            collapseTables: false,
            highlightSkolems: true,
            items: [],
            itemsSelected: [],
            layoutDirection: LayoutDirection.Row,
            nameFunction: nF,
            removeBuiltin: true,
            removeEmpty: true,
            removeThis: true,
            skolemColors: sH,
            sortPrimary: sorting.groupSort(),
            sortSecondary: sorting.sizeSort(),
            tableAlignment: HorizontalAlignment.Left,
            tables: TablesType.All
        };

    }

    componentDidMount (): void {

        if (this.props.data !== null) {

            const instance = this.props.data;
            const alpha = sorting.alphabeticalSort(nameFunction(true));
            const builtin = sorting.builtinSort();

            const items = [
                ...instance.signatures().sort(builtin).sort(alpha),
                ...instance.fields().sort(alpha),
                ...instance.skolems().sort(alpha)
            ];

            this.setState({
                items: items,
                itemsSelected: [],
                skolemColors: this._assignSkolemColors(instance.skolems())
            });

        }

    }

    componentDidUpdate (prevProps: ITableViewProps, prevState: ITableViewState): void {

        // We've recieved a new instance to render
        const newInstance = this.props.data;

        // Only run these updates if the instance has been changed
        if (newInstance !== prevProps.data) {

            // If there actually isn't a new instance, get rid of all items
            if (!newInstance) {

                this.setState({
                    items: [],
                    itemsSelected: [],
                    skolemColors: new Map()
                });

            } else {

                // Compare new items with old items so that we can maintain
                // the list of selected items as we step through instances.
                // Note that the order established here is the order the items
                // will appear in in the sidebar selector

                const alpha = sorting.alphabeticalSort(nameFunction(true));
                const builtin = sorting.builtinSort();

                const newItems = [
                    ...newInstance.signatures().sort(builtin).sort(alpha),
                    ...newInstance.fields().sort(alpha),
                    ...newInstance.skolems().sort(alpha)
                ];

                const oldSelected = prevState.itemsSelected.map(item => item.id());
                const newSelected = newItems.filter(item => oldSelected.includes(item.id()));

                this.setState({
                    items: newItems,
                    itemsSelected: newSelected,
                    skolemColors: this._assignSkolemColors(newInstance.skolems())
                });

            }

        }

    }

    render (): React.ReactNode {

        if (!this.props.visible) return null;

        const state = this.state;
        const stage = (
            <TableViewStage
                {...state}
                itemsVisible={this._getVisibleItems()}/>
        );
        const sidebar = (
            <TableViewSidebar
                {...state}
                onChooseLayoutDirection={this._onChooseLayoutDirection}
                onChooseSortingFunctions={this._onChooseSortingFunctions}
                onChooseTableAlignment={this._onChooseTableAlignment}
                onChooseTablesType={this._onChooseTablesType}
                onItemsSelected={this._onItemsSelected}
                onToggleBuiltin={this._onToggleBuiltin}
                onToggleCollapseData={this._onToggleCollapseData}
                onToggleCollapseLayout={this._onToggleCollapseLayout}
                onToggleCollapseSidebar={this._onToggleCollapseSidebar}
                onToggleCollapseSkolem={this._onToggleCollapseSkolem}
                onToggleCollapseTables={this._onToggleCollapseTables}
                onToggleHighlightSkolems={this._onToggleHighlightSkolems}
                onToggleEmpty={this._onToggleEmpty}
                onToggleRemoveThis={this._onToggleRemoveThis}
            />
        );

        return (
            <>{sidebar}{stage}</>
        );

    }

    private _assignSkolemColors = (skolems: AlloySkolem[]): Map<AlloySkolem, string> => {

        const colors = [
            "#2965CC", "#29A634", "#D99E0B", "#D13913", "#8F398F",
            "#00B3A4", "#DB2C6F", "#9BBF30", "#96622D", "#7157D9"
        ];

        const colormap = new Map();

        skolems.forEach((skolem: AlloySkolem, i: number) => {
            colormap.set(skolem, colors[i % skolems.length]);
        });

        return colormap;

    };

    private _getVisibleItems = (): SigFieldSkolem[] => {

        const type = this.state.tables;

        const items = [...this.state.items];
        const itemsVisible =
            type === TablesType.All ? items :
                type === TablesType.Signatures ? items.filter(filtering.keepSignatures) :
                    type === TablesType.Fields ? items.filter(filtering.keepFields) :
                        type === TablesType.Skolems ? items.filter(filtering.keepSkolems) :
                            type === TablesType.Select ? [...this.state.itemsSelected] : [];


        const pass = () => true;
        const itemsFiltered = type === TablesType.Select
            ? itemsVisible
            : itemsVisible
                .filter(this.state.removeBuiltin ? filtering.removeBuiltins : pass)
                .filter(this.state.removeEmpty ? filtering.removeEmptys : pass)
                .filter(this.state.highlightSkolems ? filtering.removeSkolems : pass);

        return itemsFiltered
            .sort(this.state.sortSecondary)
            .sort(this.state.sortPrimary);

    };
    
    private _onChooseLayoutDirection = (layout: LayoutDirection): void => {
        this.setState({layoutDirection: layout});
    };

    private _onChooseSortingFunctions = (primary: TableSortFunction, secondary: TableSortFunction): void => {
        this.setState({sortPrimary: primary, sortSecondary: secondary});
    };
    
    private _onChooseTableAlignment = (align: HorizontalAlignment): void => {
        this.setState({tableAlignment: align});
    };
    
    private _onChooseTablesType = (type: TablesType): void => {
        this.setState({tables: type});
    };
    
    private _onItemsSelected = (items: SigFieldSkolem[]): void => {
        this.setState({itemsSelected: items, tables: TablesType.Select});
    };
    
    private _onToggleBuiltin = (): void => {
        this.setState({removeBuiltin: !this.state.removeBuiltin});
    };

    private _onToggleCollapseSidebar = () => {
        const curr = this.state.collapseSidebar;
        this.setState({collapseSidebar: !curr});
    };

    private _onToggleCollapseData = (): void => {
        this.setState({collapseData: !this.state.collapseData});
    };

    private _onToggleCollapseLayout = (): void => {
        this.setState({collapseLayout: !this.state.collapseLayout});
    };

    private _onToggleCollapseSkolem = (): void => {
        this.setState({collapseSkolem: !this.state.collapseSkolem});
    };

    private _onToggleCollapseTables = (): void => {
        this.setState({collapseTables: !this.state.collapseTables});
    };
    
    private _onToggleEmpty = (): void => {
        this.setState({removeEmpty: !this.state.removeEmpty});
    };

    private _onToggleHighlightSkolems = (): void => {
        const newTables = this.state.tables === TablesType.Skolems ? TablesType.All : this.state.tables;
        this.setState({
            highlightSkolems: !this.state.highlightSkolems,
            tables: newTables
        });
    };
    
    private _onToggleRemoveThis = (): void => {
        const newRemove = !this.state.removeThis;
        const newNameFn = nameFunction(newRemove);
        this.setState({removeThis: newRemove, nameFunction: newNameFn});
    };

}

export default TableView;
