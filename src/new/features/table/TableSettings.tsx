import {
    Alignment,
    Button,
    ButtonGroup,
    FormGroup,
    Radio,
    RadioGroup,
    Switch
} from '@blueprintjs/core';
import { AlloyInstance } from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import SterlingDrawer from '../../sterling/SterlingDrawer';
import {
    HorizontalAlignment,
    LayoutDirection,
    setAlignment,
    setLayoutDirection,
    setSortDirection,
    setSortType,
    setTableTypes,
    SortDirection,
    SortType,
    TablesType,
    toggleCollapseData,
    toggleCollapseLayout,
    toggleCollapseTables,
    toggleHighlightSkolems,
    toggleRemoveBuiltin,
    toggleRemoveEmpty,
    toggleRemoveThis
} from './tableSlice';

// Map redux state to table settings props
const mapState = (state: RootState) => ({
    settings: state.tableSlice
});

// Actions
const mapDispatch = {
    setAlignment,
    setLayoutDirection,
    setSortDirection,
    setSortType,
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
type TableSettingsReduxProps = ConnectedProps<typeof connector>;

// Create a combined type for all props
export type TableSettingsProps = TableSettingsReduxProps & {
    instance: AlloyInstance | null
}

// The table settings view
const TableSettings: React.FunctionComponent<TableSettingsProps> = props => {

    const settings = props.settings;

    return (
        <>
            <SterlingDrawer.Section
                collapsed={settings.collapseTables}
                onToggle={props.toggleCollapseTables}
                title={'Tables'}>
                <FormGroup>
                    <RadioGroup
                        onChange={event => props.setTableTypes(parseInt(event.currentTarget.value))}
                        selectedValue={settings.tablesType}>
                        <Radio label='All Tables' value={TablesType.All}/>
                        <Radio label='Signatures' value={TablesType.Signatures}/>
                        <Radio label='Fields' value={TablesType.Fields}/>
                        <Radio label='Skolems' disabled={settings.highlightSkolems} value={TablesType.Skolems}/>
                        <Radio label='Choose Tables' value={TablesType.Select}/>
                    </RadioGroup>
                </FormGroup>
            </SterlingDrawer.Section>
            <SterlingDrawer.Section
                collapsed={settings.collapseData}
                onToggle={props.toggleCollapseData}
                title={'Data Options'}>
                <FormGroup>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={settings.removeBuiltin}
                        disabled={settings.tablesType === TablesType.Select}
                        label='Hide Built-in Signatures'
                        onChange={props.toggleRemoveBuiltin}/>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={settings.removeEmpty}
                        disabled={settings.tablesType === TablesType.Select}
                        label='Hide Empty Tables'
                        onChange={props.toggleRemoveEmpty}/>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={settings.removeThis}
                        label='Remove "this" from Signature names'
                        onChange={props.toggleRemoveThis}/>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={settings.highlightSkolems}
                        label='Display Skolems as highlighted rows'
                        onChange={props.toggleHighlightSkolems}/>

                </FormGroup>
            </SterlingDrawer.Section>
            <SterlingDrawer.Section
                collapsed={settings.collapseLayout}
                onToggle={props.toggleCollapseLayout}
                title={'Layout Options'}>
                <FormGroup>
                    <FormGroup inline={true} label='Layout Direction'>
                        <ButtonGroup>
                            <Button
                                active={settings.layoutDirection === LayoutDirection.Row}
                                icon='vertical-distribution'
                                onClick={() => props.setLayoutDirection(LayoutDirection.Row)}/>
                            <Button
                                active={settings.layoutDirection === LayoutDirection.Column}
                                icon='horizontal-distribution'
                                onClick={() => props.setLayoutDirection(LayoutDirection.Column)}/>
                        </ButtonGroup>
                    </FormGroup>

                    <FormGroup inline={true} label='Align'>
                        <ButtonGroup>
                            <Button
                                active={settings.alignment === HorizontalAlignment.Left}
                                icon='align-left'
                                onClick={() => props.setAlignment(HorizontalAlignment.Left)}/>
                            <Button
                                active={settings.alignment === HorizontalAlignment.Center}
                                icon='align-center'
                                onClick={() => props.setAlignment(HorizontalAlignment.Center)}/>
                            <Button
                                active={settings.alignment === HorizontalAlignment.Right}
                                icon='align-right'
                                onClick={() => props.setAlignment(HorizontalAlignment.Right)}/>
                        </ButtonGroup>
                    </FormGroup>

                    <FormGroup inline={true} label='Sort'>
                        <ButtonGroup>
                            <Button
                                icon='group-objects'
                                onClick={() => {
                                    props.setSortType(SortType.Group);
                                    props.setSortDirection(SortDirection.Ascending);
                                }}/>
                            <Button
                                icon='sort-alphabetical'
                                onClick={() => {
                                    props.setSortType(SortType.Alphabetical);
                                    props.setSortDirection(SortDirection.Ascending);
                                }}/>
                            <Button
                                icon='sort-alphabetical-desc'
                                onClick={() => {
                                    props.setSortType(SortType.Alphabetical);
                                    props.setSortDirection(SortDirection.Descending);
                                }}/>
                            <Button
                                icon='sort-numerical'
                                onClick={() => {
                                    props.setSortType(SortType.Size);
                                    props.setSortDirection(SortDirection.Ascending);
                                }}/>
                            <Button
                                icon='sort-numerical-desc'
                                onClick={() => {
                                    props.setSortType(SortType.Size);
                                    props.setSortDirection(SortDirection.Descending);
                                }}/>
                        </ButtonGroup>
                    </FormGroup>

                </FormGroup>
            </SterlingDrawer.Section>
        </>
    )

};

export default connector(TableSettings);