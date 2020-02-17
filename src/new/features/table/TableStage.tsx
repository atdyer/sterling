import { Card } from '@blueprintjs/core';
import {
    AlloyElement,
    AlloyField,
    AlloySignature,
    AlloySkolem,
    filtering,
    sorting
} from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import FieldHTMLTable, { IFieldHTMLTableProps } from './stage-components/FieldHTMLTable';
import SignatureHTMLTable, { ISignatureHTMLTableProps } from './stage-components/SignatureHTMLTable';
import SkolemHTMLTable, { ISkolemHTMLTableProps } from './stage-components/SkolemHTMLTable';
import { FieldTag, SignatureTag, SkolemTag } from './TableTags';
import {
    AlloyNameFn,
    AlloySortFn,
    HorizontalAlignment,
    LayoutDirection,
    SigFieldSkolem,
    SortDirection,
    SortMethod,
    SortType,
    TablesType
} from './tableTypes';

// Map redux state to table settings props
const mapState = (state: RootState) => ({
    settings: state.tableSlice
});

// Create connector
const connector = connect(mapState);

// Create props for things from redux
type TableStageProps = ConnectedProps<typeof connector>;

// The table stage component
const TableStage: React.FunctionComponent<TableStageProps> = props => {

    const settings = props.settings;

    const alignment = alignClass(settings.alignment);
    const direction = layoutClass(settings.layoutDirection);
    const nameFunction = buildNameFunction(settings.removeThis);
    const primarySort = buildSortFunction(settings.primarySort, nameFunction);
    const secondSort = buildSortFunction(settings.secondarySort, nameFunction);
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

    data = data
        .sort(secondSort)
        .sort(primarySort);

    return (
        <div className={`tables ${alignment} ${direction}`}>
            {
                data.map(item => (
                    <Card key={item.id()}
                          elevation={1}>
                        { buildTableHeader(item, nameFunction) }
                        { buildTable(item, nameFunction) }
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

function buildNameFunction (removeThis: boolean): AlloyNameFn {
    return (item: AlloyElement) => {
        return removeThis
            ? item.id().replace(/^this\//, '')
            : item.id();
    }
}

function buildSortFunction (type: SortType, nameFunction: AlloyNameFn): AlloySortFn {
    if (type.method === SortMethod.Size) {
        return sorting.sizeSort(type.direction === SortDirection.Ascending);
    }
    if (type.method === SortMethod.Alphabetical) {
        return sorting.alphabeticalSort(nameFunction, type.direction === SortDirection.Ascending);
    }
    if (type.method === SortMethod.Group) {
        return sorting.groupSort();
    }
    return () => 0;
}

function buildTable (item: SigFieldSkolem, nameFunction: AlloyNameFn): React.ReactNode {
    if (item.expressionType() === 'signature') {
        const props: ISignatureHTMLTableProps = {
            highlightSkolems: false,
            signature: item as AlloySignature,
            skolemColors: new Map()
        };
        return SignatureHTMLTable(props);
    }
    if (item.expressionType() === 'field') {
        const props: IFieldHTMLTableProps = {
            field: item as AlloyField,
            highlightSkolems: false,
            nameFunction: nameFunction,
            skolemColors: new Map()
        };
        return FieldHTMLTable(props);
    }
    if (item.expressionType() === 'skolem') {
        const props: ISkolemHTMLTableProps = {
            nameFunction: nameFunction,
            skolem: item as AlloySkolem
        };
        return SkolemHTMLTable(props);
    }
    return null;
}

function buildTableHeader (item: SigFieldSkolem, nameFunction: AlloyNameFn): React.ReactNode {

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