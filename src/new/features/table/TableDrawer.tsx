import {
    Alignment,
    Button,
    ButtonGroup,
    FormGroup,
    Radio,
    RadioGroup,
    Switch
} from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import SterlingDrawer from '../../sterling/SterlingDrawer';
import AlloyMultiSelect from './drawer-components/AlloyMultiSelect';
import {
    clearSelectedData,
    deselectData,
    selectData,
    setAlignment,
    setLayoutDirection,
    setSort,
    setTableTypes,
    toggleCollapseData,
    toggleCollapseLayout,
    toggleCollapseTables,
    toggleHighlightSkolems,
    toggleRemoveBuiltin,
    toggleRemoveEmpty,
    toggleRemoveThis
} from './tableSlice';
import {
    buildNameFunction,
    HorizontalAlignment,
    LayoutDirection,
    SortDirection,
    SortMethod,
    TablesType
} from './tableTypes';

// Map redux state to table settings props
const mapState = (state: RootState) => ({
    ...state.tableSlice
});

// Actions
const mapDispatch = {
    clearSelectedData,
    deselectData,
    selectData,
    setAlignment,
    setLayoutDirection,
    setSort,
    setTableTypes,
    toggleCollapseData,
    toggleCollapseLayout,
    toggleCollapseTables,
    toggleHighlightSkolems,
    toggleRemoveBuiltin,
    toggleRemoveEmpty,
    toggleRemoveThis
};

// Connect the two
const connector = connect(
    mapState,
    mapDispatch
);

// Create props for things from redux
type TableDrawerProps = ConnectedProps<typeof connector>;

// The table settings view
const TableDrawer: React.FunctionComponent<TableDrawerProps> = props => {

    return (
        <>
            <SterlingDrawer.Section
                collapsed={props.collapseTables}
                onToggle={props.toggleCollapseTables}
                style={{ zIndex: 1 }}
                title={'Tables'}>
                <FormGroup>
                    <RadioGroup
                        onChange={event => props.setTableTypes(parseInt(event.currentTarget.value))}
                        selectedValue={props.tablesType}>
                        <Radio label='All Tables' value={TablesType.All}/>
                        <Radio label='Signatures' value={TablesType.Signatures}/>
                        <Radio label='Fields' value={TablesType.Fields}/>
                        <Radio label='Skolems' disabled={props.highlightSkolems} value={TablesType.Skolems}/>
                        <Radio label='Choose Tables' value={TablesType.Select}/>
                        <AlloyMultiSelect
                            items={props.data}
                            itemsSelected={props.dataSelected}
                            onClearSelectedItems={props.clearSelectedData}
                            onDeselectItem={props.deselectData}
                            onSelectItem={props.selectData}
                            nameFunction={buildNameFunction(props.removeThis)}/>
                    </RadioGroup>
                </FormGroup>
            </SterlingDrawer.Section>
            <SterlingDrawer.Section
                collapsed={props.collapseData}
                onToggle={props.toggleCollapseData}
                title={'Data Options'}>
                <FormGroup>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={props.removeBuiltin}
                        disabled={props.tablesType === TablesType.Select}
                        label='Hide Built-in Signatures'
                        onChange={props.toggleRemoveBuiltin}/>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={props.removeEmpty}
                        disabled={props.tablesType === TablesType.Select}
                        label='Hide Empty Tables'
                        onChange={props.toggleRemoveEmpty}/>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={props.removeThis}
                        label='Remove "this" from Signature names'
                        onChange={props.toggleRemoveThis}/>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={props.highlightSkolems}
                        label='Display Skolems as highlighted rows'
                        onChange={props.toggleHighlightSkolems}/>

                </FormGroup>
            </SterlingDrawer.Section>
            <SterlingDrawer.Section
                collapsed={props.collapseLayout}
                onToggle={props.toggleCollapseLayout}
                title={'Layout Options'}>
                <FormGroup>
                    <FormGroup inline={true} label='Layout Direction'>
                        <ButtonGroup>
                            <Button
                                active={props.layoutDirection === LayoutDirection.Row}
                                icon='vertical-distribution'
                                onClick={() => props.setLayoutDirection(LayoutDirection.Row)}/>
                            <Button
                                active={props.layoutDirection === LayoutDirection.Column}
                                icon='horizontal-distribution'
                                onClick={() => props.setLayoutDirection(LayoutDirection.Column)}/>
                        </ButtonGroup>
                    </FormGroup>

                    <FormGroup inline={true} label='Align'>
                        <ButtonGroup>
                            <Button
                                active={props.alignment === HorizontalAlignment.Left}
                                icon='align-left'
                                onClick={() => props.setAlignment(HorizontalAlignment.Left)}/>
                            <Button
                                active={props.alignment === HorizontalAlignment.Center}
                                icon='align-center'
                                onClick={() => props.setAlignment(HorizontalAlignment.Center)}/>
                            <Button
                                active={props.alignment === HorizontalAlignment.Right}
                                icon='align-right'
                                onClick={() => props.setAlignment(HorizontalAlignment.Right)}/>
                        </ButtonGroup>
                    </FormGroup>

                    <FormGroup inline={true} label='Sort'>
                        <ButtonGroup>
                            <Button
                                icon='group-objects'
                                onClick={() => {
                                    props.setSort({
                                        method: SortMethod.Group,
                                        direction: SortDirection.Ascending
                                    });
                                }}/>
                            <Button
                                icon='sort-alphabetical'
                                onClick={() => {
                                    props.setSort({
                                        method: SortMethod.Alphabetical,
                                        direction: SortDirection.Ascending
                                    });
                                }}/>
                            <Button
                                icon='sort-alphabetical-desc'
                                onClick={() => {
                                    props.setSort({
                                        method: SortMethod.Alphabetical,
                                        direction: SortDirection.Descending
                                    });
                                }}/>
                            <Button
                                icon='sort-numerical'
                                onClick={() => {
                                    props.setSort({
                                        method: SortMethod.Size,
                                        direction: SortDirection.Ascending
                                    });
                                }}/>
                            <Button
                                icon='sort-numerical-desc'
                                onClick={() => {
                                    props.setSort({
                                        method: SortMethod.Size,
                                        direction: SortDirection.Descending
                                    });
                                }}/>
                        </ButtonGroup>
                    </FormGroup>

                </FormGroup>
            </SterlingDrawer.Section>
        </>
    )

};

export default connector(TableDrawer);
