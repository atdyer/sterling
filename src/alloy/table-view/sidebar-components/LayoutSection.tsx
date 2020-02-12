import { Button, ButtonGroup, FormGroup } from '@blueprintjs/core';
import { sorting } from 'alloy-ts';
import * as React from 'react';
import {
    HorizontalAlignment,
    LayoutDirection,
    SortDirection,
    TableSortFunction
} from '../../../sterling/SterlingTypes';
import SterlingSidebar from '../../../sterling/SterlingSidebar';
import { ITableViewState } from '../TableView';

export interface ILayoutSectionProps extends ITableViewState {
    onChooseLayoutDirection: (direction: LayoutDirection) => void,
    onChooseSortingFunctions: (primary: TableSortFunction, secondary: TableSortFunction) => void,
    onChooseTableAlignment: (alignment: HorizontalAlignment) => void,
    onToggleCollapse: () => void
}

class LayoutSection extends React.Component<ILayoutSectionProps> {

    render (): React.ReactNode {

        const props = this.props;

        return (
            <SterlingSidebar.Section
                collapsed={props.collapseLayout}
                onToggleCollapse={props.onToggleCollapse}
                title='Layout Options'>

                <FormGroup>
                    <FormGroup inline={true} label='Layout Direction'>
                        <ButtonGroup>
                            <Button
                                active={props.layoutDirection === LayoutDirection.Row}
                                icon='vertical-distribution'
                                onClick={() => props.onChooseLayoutDirection(LayoutDirection.Row)}/>
                            <Button
                                active={props.layoutDirection === LayoutDirection.Column}
                                icon='horizontal-distribution'
                                onClick={() => props.onChooseLayoutDirection(LayoutDirection.Column)}/>
                        </ButtonGroup>
                    </FormGroup>

                    <FormGroup inline={true} label='Align'>
                        <ButtonGroup>
                            <Button
                                active={props.tableAlignment === HorizontalAlignment.Left}
                                icon='align-left'
                                onClick={() => props.onChooseTableAlignment(HorizontalAlignment.Left)}/>
                            <Button
                                active={props.tableAlignment === HorizontalAlignment.Center}
                                icon='align-center'
                                onClick={() => props.onChooseTableAlignment(HorizontalAlignment.Center)}/>
                            <Button
                                active={props.tableAlignment === HorizontalAlignment.Right}
                                icon='align-right'
                                onClick={() => props.onChooseTableAlignment(HorizontalAlignment.Right)}/>
                        </ButtonGroup>
                    </FormGroup>

                    <FormGroup inline={true} label='Sort'>
                        <ButtonGroup>
                            <Button
                                icon='group-objects'
                                onClick={() => this._chooseGroupSort()}/>
                            <Button
                                icon='sort-alphabetical'
                                onClick={() => this._chooseAlphaSort(SortDirection.Ascending)}/>
                            <Button
                                icon='sort-alphabetical-desc'
                                onClick={() => this._chooseAlphaSort(SortDirection.Descending)}/>
                            <Button
                                icon='sort-numerical'
                                onClick={() => this._chooseNumSort(SortDirection.Ascending)}/>
                            <Button
                                icon='sort-numerical-desc'
                                onClick={() => this._chooseNumSort(SortDirection.Descending)}/>
                        </ButtonGroup>
                    </FormGroup>

                </FormGroup>

            </SterlingSidebar.Section>
        )

    }

    /**
     * Callback used to set the primary and secondary sorting functions. The
     * current primary sorting function will be bumped down to act as the
     * new secondary sorting function
     * @param direction Sort alphabetically ascending or descending
     * @private
     */
    private _chooseAlphaSort = (direction: SortDirection): void => {

        const oldPrimary = this.props.sortPrimary;
        const newPrimary = direction === SortDirection.Ascending
            ? sorting.alphabeticalSort(this.props.nameFunction, true)
            : sorting.alphabeticalSort(this.props.nameFunction, false);
        this.props.onChooseSortingFunctions(newPrimary, oldPrimary);

    };

    /**
     * Callback used to set the primary and secondary sorting functions. The
     * current primary sorting function will be bumped down to act as the
     * new secondary sorting function. The new primary sorting function will
     * sort by item type in the following order: signatures, fields, skolems.
     * @private
     */
    private _chooseGroupSort = (): void => {
        this.props.onChooseSortingFunctions(sorting.groupSort(), this.props.sortPrimary);
    };

    /**
     * Callback used to set the primary and secondary sorting functions. The
     * current primary sorting function will be bumped down to act as the
     * new secondary sorting function
     * @param direction Sort by size ascending or descending
     * @private
     */
    private _chooseNumSort = (direction: SortDirection): void => {

        const oldPrimary = this.props.sortPrimary;
        const newPrimary = direction === SortDirection.Ascending
            ? sorting.sizeSort()
            : sorting.sizeSort(false);
        this.props.onChooseSortingFunctions(newPrimary, oldPrimary);

    };

}

export default LayoutSection;
