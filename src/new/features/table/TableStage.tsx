import { Card } from '@blueprintjs/core';
import { AlloyField, AlloySignature, AlloySkolem, filtering } from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import {
    HorizontalAlignment,
    LayoutDirection,
    SigFieldSkolem,
    TablesType
} from './tableSlice';
import { FieldTag, SignatureTag, SkolemTag } from './TableTags';

// Map redux state to table settings props
const mapState = (state: RootState) => ({
    settings: state.tableSlice
});

// Create connector
const connector = connect(mapState);

// Create props for things from redux
type TableStageProps = ConnectedProps<typeof connector>;

const TableStage: React.FunctionComponent<TableStageProps> = props => {

    const settings = props.settings;

    const alignment = alignClass(settings.alignment);
    const direction = layoutClass(settings.layoutDirection);
    const nameFunction = buildNameFunction(settings.removeThis);
    const type = settings.tablesType;

    let data = type === TablesType.All ? settings.data :
        type === TablesType.Signatures ? settings.data.filter(filtering.keepSignatures) :
        type === TablesType.Fields ? settings.data.filter(filtering.keepFields) :
        type === TablesType.Skolems ? settings.data.filter(filtering.keepSkolems) :
        type === TablesType.Select ? [] : [];

    const pass = () => true;
    data = type === TablesType.Select
        ? data
        : data
            .filter(settings.removeBuiltin ? filtering.removeBuiltins : pass)
            .filter(settings.removeEmpty ? filtering.removeEmptys : pass)
            .filter(settings.highlightSkolems ? filtering.removeSkolems : pass);

    return (
        <div className={`tables ${alignment} ${direction}`}>
            {
                data.map(item => (
                    <Card key={item.id()}
                          elevation={1}>
                        { buildTableHeader(item, nameFunction) }
                        { buildTable(item) }
                    </Card>
                ))
            }
        </div>
    );

};

function alignClass (alignment: HorizontalAlignment): string {
    return alignment === HorizontalAlignment.Left ? 'left' :
        alignment === HorizontalAlignment.Center ? 'center' :
        alignment === HorizontalAlignment.Right ? 'right' : '';
}

// function buildFilter (filter: Filter)

function buildNameFunction (removeThis: boolean): (item: SigFieldSkolem) => string {
    return (item: SigFieldSkolem) => {
        return removeThis
            ? item.id().replace(/^this\//, '')
            : item.id();
    }
}

function buildTable (item: SigFieldSkolem): React.ReactNode {
    return <div/>;
}

function buildTableHeader (
    item: SigFieldSkolem,
    nameFunction: (item: SigFieldSkolem) => string
): React.ReactNode {

    if (item.expressionType() === 'signature') {
        return <SignatureTag signature={item as AlloySignature}
                             nameFunction={nameFunction}/>;
    }

    if (item.expressionType() === 'field') {
        return <FieldTag field={item as AlloyField}
                         nameFunction={nameFunction}/>;
    }

    if (item.expressionType() === 'skolem') {
        return <SkolemTag skolem={item as AlloySkolem}
                          nameFunction={nameFunction}/>;
    }

    return null;

}

function layoutClass (direction: LayoutDirection): string {
    return direction === LayoutDirection.Row ? 'row' :
        direction === LayoutDirection.Column ? 'column' : '';
}


export default connector(TableStage);