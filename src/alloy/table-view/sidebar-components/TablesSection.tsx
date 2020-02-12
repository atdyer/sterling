import * as React from 'react';
import SterlingSidebar from '../../../sterling/SterlingSidebar';
import { FormGroup, Radio, RadioGroup } from '@blueprintjs/core';
import AlloyMultiSelect from './tables-section-components/AlloyMultiSelect';
import { ITableViewState } from '../TableView';
import { SigFieldSkolem, TablesType } from '../../../sterling/SterlingTypes';

export interface ITablesSectionProps extends ITableViewState {
    onChooseTablesType: (type: TablesType) => void,
    onItemsSelected: (items: SigFieldSkolem[]) => void,
    onToggleCollapse: () => void,
}

class TablesSection extends React.Component<ITablesSectionProps> {

    render (): React.ReactNode {

        const props = this.props;

        return (
            <SterlingSidebar.Section
                collapsed={props.collapseTables}
                onToggleCollapse={props.onToggleCollapse}
                title='Tables'>

                <FormGroup>

                    <RadioGroup
                        onChange={this._handleRadioChange}
                        selectedValue={props.tables}>

                        <Radio label='All Tables' value={TablesType.All}/>
                        <Radio label='Signatures' value={TablesType.Signatures}/>
                        <Radio label='Fields' value={TablesType.Fields}/>
                        <Radio label='Skolems' disabled={props.highlightSkolems} value={TablesType.Skolems}/>
                        <Radio label='Choose Tables' value={TablesType.Select}/>
                        <AlloyMultiSelect
                            items={props.items}
                            onClearSelectedItems={this._clearItems}
                            onDeselectItem={this._removeItem}
                            onSelectItem={this._addItem}
                            nameFunction={props.nameFunction}
                            itemsSelected={props.itemsSelected}/>

                    </RadioGroup>

                </FormGroup>

            </SterlingSidebar.Section>
        )

    }

    /**
     * Select a table by adding it to the list of selected tables
     * @param item The item to select
     * @private
     */
    private _addItem = (item: SigFieldSkolem): void => {

        const curr = this.props.itemsSelected;
        this.props.onItemsSelected([...curr, item]);

    };

    /**
     * Clear selected tables by selecting no items
     * @private
     */
    private _clearItems = (): void => {

        this.props.onItemsSelected([]);

    };

    /**
     * Deselect a currently selected table by removing it from the list of
     * selected tables.
     * @param item The item to deselect
     * @private
     */
    private _removeItem = (item: SigFieldSkolem): void => {

        const next: SigFieldSkolem[] = [...this.props.itemsSelected];
        const idx = next.indexOf(item);
        if (idx >= 0) {
            next.splice(idx, 1);
            this.props.onItemsSelected(next);
        }

    };

    /**
     * Callback used to handle changing of radio button selection. Radio buttons
     * determine which set of tables are visible and options are 'all',
     * 'signatures', 'fields', 'skolems', and 'select'.
     * @param event
     */
    private _handleRadioChange = (event: React.FormEvent<HTMLInputElement>): void => {

        this.props.onChooseTablesType(parseInt(event.currentTarget.value));

    };

}

export default TablesSection;
