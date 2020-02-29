import {
    Button,
    Icon,
    ITagProps,
    Menu,
    MenuDivider,
    MenuItem
} from '@blueprintjs/core';
import {
    IItemListRendererProps,
    IItemRendererProps,
    ItemPredicate,
    MultiSelect
} from '@blueprintjs/select';
import { AlloyField, AlloySignature, AlloySkolem, sorting } from 'alloy-ts';
import * as React from 'react';
import { AlloyNameFn, SigFieldSkolem } from '../tableTypes';
import { FieldTag, SignatureTag } from '../TableTags';

const AlloySelect = MultiSelect.ofType<SigFieldSkolem>();

export interface IAlloyMultiSelectProps {
    items: SigFieldSkolem[],
    itemsSelected: SigFieldSkolem[],
    onClearSelectedItems: () => void,
    onDeselectItem: (item: SigFieldSkolem) => void,
    onSelectItem: (item: SigFieldSkolem) => void,
    nameFunction: AlloyNameFn
}

class AlloyMultiSelect extends React.Component<IAlloyMultiSelectProps> {

    render (): React.ReactNode {

        const props = this.props;

        const sortItems = (items: SigFieldSkolem[]): SigFieldSkolem[] => {

            const sigs = items.filter(item => item.expressionType() === 'signature');
            const flds = items.filter(item => item.expressionType() === 'field');
            const skls = items.filter(item => item.expressionType() === 'skolem');
            const alpha = sorting.alphabeticalSort(this.props.nameFunction);
            (sigs as AlloySignature[]).sort(alpha).sort(sorting.builtinSort());
            (flds as AlloyField[]).sort(alpha);
            (skls as AlloySkolem[]).sort(alpha);
            return [...sigs, ...flds, ...skls];

        };

        const clearButton = this.props.itemsSelected.length
            ? <Button
                icon='cross'
                minimal={true}
                onClick={this.props.onClearSelectedItems}/>
            : undefined;

        return (
            <AlloySelect
                fill={true}
                items={sortItems(props.items)}
                itemPredicate={this._filterItem}
                itemRenderer={this._renderItem}
                itemListRenderer={this._renderList}
                onItemSelect={this._onSelectItem}
                popoverProps={{
                    usePortal: false
                }}
                placeholder='Choose Tables...'
                resetOnSelect={true}
                scrollToActiveItem={true}
                selectedItems={this.props.itemsSelected}
                tagInputProps={{
                    onRemove: this._onRemoveTag,
                    rightElement: clearButton,
                    tagProps: this._tagProps
                }}
                tagRenderer={this._renderTag}
                />
        )

    }

    /**
     * Predicate used to determine if a query string exists in the name of a
     * Signature, Field, or Skolem.
     * @param query The query string
     * @param item The Signature, Field, or Skolem
     * @private
     * @return Returns true if the query string appears in the name of the item,
     * false otherwise.
     */
    private _filterItem: ItemPredicate<SigFieldSkolem> = (query: string, item: SigFieldSkolem): boolean => {

        const name = item.expressionType() === 'field'
            ? this.props.nameFunction(item).split('<:')[1]
            : this.props.nameFunction(item);

        return name.toLowerCase().indexOf(query.toLowerCase()) >= 0;

    };

    /**
     * Determine if an item is currently selected
     * @param item The item in question
     * @private
     * @return Returns true if the item is currently selected, false otherwise
     */
    private _isItemSelected = (item: SigFieldSkolem) => {
        return this.props.itemsSelected.includes(item);
    };

    /**
     * Event handler used when a tag is removed from the current selection
     * @param tag The tag text
     * @param index The index of the tag in the selected items list
     * @private
     */
    private _onRemoveTag = (tag: string, index: number): void => {
        this.props.onDeselectItem(this.props.itemsSelected[index]);
    };

    /**
     * Event handler used when an item in the list is selected
     * @param item The selected item
     * @private
     */
    private _onSelectItem = (item: SigFieldSkolem): void => {

        this._isItemSelected(item)
            ? this.props.onDeselectItem(item)
            : this.props.onSelectItem(item);

    };

    /**
     * Custom renderer for an Alloy item in the dropdown list.
     * @param item The Alloy item to render
     * @param props The rendering properties
     * @private
     */
    private _renderItem = (item: SigFieldSkolem, props: IItemRendererProps): React.ReactElement | null => {

        if (!props.modifiers.matchesPredicate) return null;
        switch (item.expressionType()) {
            case 'signature':
                return this._renderSignature(item as AlloySignature, props);
            case 'field':
                return this._renderField(item as AlloyField, props);
            case 'skolem':
                return this._renderSkolem(item as AlloySkolem, props);
            default:
                return null;
        }

    };

    /**
     * Custom renderer for the contents of the dropdown list. Splits list into
     * three categories (Signatures, Fields, Skolems) sorted alphabetically.
     * @param props Properties describing how to render a list of items
     * @private
     */
    private _renderList = (props: IItemListRendererProps<SigFieldSkolem>): React.ReactElement => {

        const sigs = props.items.filter(item => item.expressionType() === 'signature');
        const flds = props.items.filter(item => item.expressionType() === 'field');
        const skls = props.items.filter(item => item.expressionType() === 'skolem');
        const alpha = sorting.alphabeticalSort(this.props.nameFunction);
        (sigs as AlloySignature[]).sort(alpha).sort(sorting.builtinSort());
        (flds as AlloyField[]).sort(alpha);
        (skls as AlloySkolem[]).sort(alpha);
        const renderedSigs = sigs.map(props.renderItem).filter(item => item != null);
        const renderedFlds = flds.map(props.renderItem).filter(item => item != null);
        const renderedSkls = skls.map(props.renderItem).filter(item => item != null);
        return (
            <Menu ulRef={props.itemsParentRef}>
                <MenuDivider title='Signatures'/>
                {renderedSigs.length ? renderedSigs : <MenuItem disabled={true} text='None'/>}
                <MenuDivider title='Fields'/>
                {renderedFlds.length ? renderedFlds : <MenuItem disabled={true} text='None'/>}
                <MenuDivider title='Skolems'/>
                {renderedSkls.length ? renderedSkls : <MenuItem disabled={true} text='None'/>}
            </Menu>
        );

    };

    /**
     * Custom renderer for an Alloy Signature in the dropdown list
     * @param item The Signature
     * @param props The rendering properties
     * @private
     */
    private _renderSignature = (item: AlloySignature, props: IItemRendererProps): React.ReactElement => {
        const selected = this._isItemSelected(item);
        return (
            <MenuItem
                active={props.modifiers.active}
                disabled={props.modifiers.disabled}
                key={item.id()}
                labelElement={highlightText(this.props.nameFunction(item), props.query)}
                icon={selected ? 'tick' : 'blank'}
                onClick={props.handleClick}/>
        );
    };

    /**
     * Custom renderer for an Alloy Field in the dropdown list
     * @param item The Field
     * @param props The rendering properties
     * @private
     */
    private _renderField = (item: AlloyField, props: IItemRendererProps) => {
        const name = this.props.nameFunction(item);
        const tokens = name.split('<:');
        const selected = this._isItemSelected(item);
        return (
            <MenuItem
                active={props.modifiers.active}
                disabled={props.modifiers.disabled}
                key={item.id()}
                icon={<>
                    { selected && <Icon icon='tick'/>}
                    <SignatureTag signature={tokens[0]}/>
                </>}
                labelElement={highlightText(tokens[1], props.query)}
                onClick={props.handleClick}/>
        );
    };

    /**
     * Custom renderer for an Alloy Skolem in the dropdown list
     * @param item The Skolem
     * @param props The rendering properties
     * @private
     */
    private _renderSkolem = (item: AlloySkolem, props: IItemRendererProps) => {
        const selected = this._isItemSelected(item);
        return (
            <MenuItem
                active={props.modifiers.active}
                disabled={props.modifiers.disabled}
                icon={selected ? 'tick' : 'blank'}
                key={item.id()}
                labelElement={highlightText(item.name(), props.query)}
                onClick={props.handleClick}/>
        );
    };

    /**
     * Custom renderer for tags in the select. Does not actually generate a Tag,
     * but instead returns the node that will be used as the label of the tag.
     * @param item The Alloy item to render
     * @private
     */
    private _renderTag = (item: SigFieldSkolem): React.ReactNode => {

        const name = this.props.nameFunction(item);
        return item.expressionType() === 'field'
            ? FieldTag.FieldTagEls(name.split('<:'))
            : name;

    };

    /**
     * Custom properties to pass to each Tag based on type of item the tag
     * represents
     * @param value The node
     * @param index The index of the item in the selected items list
     * @private
     */
    private _tagProps = (value: React.ReactNode, index: number): ITagProps => {

        const itemType = this.props.itemsSelected[index].expressionType();
        const tag = itemType === 'signature'
            ? 'sig-tag' : itemType === 'field'
                ? 'field-tag' : itemType === 'skolem'
                    ? 'skolem-tag' : '';
        return {
            className: tag
        };

    }

}

function highlightText (text: string, query: string) {
    let lastIndex = 0;
    const words = query
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(escapeRegExpChars);
    if (words.length === 0) {
        return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens: React.ReactNode[] = [];
    while (true) {
        const match = regexp.exec(text);
        if (!match) {
            break;
        }
        const length = match[0].length;
        const before = text.slice(lastIndex, regexp.lastIndex - length);
        if (before.length > 0) {
            tokens.push(before);
        }
        lastIndex = regexp.lastIndex;
        tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
        tokens.push(rest);
    }
    return tokens;
}

function escapeRegExpChars (text: string) {
    return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}

export default AlloyMultiSelect;
