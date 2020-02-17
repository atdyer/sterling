import { Card } from '@blueprintjs/core';
import { AlloyField, AlloySignature, AlloySkolem, filtering } from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import FieldHTMLTable from './stage-components/FieldHTMLTable';
import SignatureHTMLTable from './stage-components/SignatureHTMLTable';
import SkolemHTMLTable from './stage-components/SkolemHTMLTable';
import { FieldTag, SignatureTag, SkolemTag } from './TableTags';
import {
    getAlignClass,
    AlloyNameFn,
    buildNameFunction,
    buildSortFunction,
    getLayoutClass,
    SigFieldSkolem,
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

    const alignment = getAlignClass(settings.alignment);
    const direction = getLayoutClass(settings.layoutDirection);
    const nameFunction = buildNameFunction(settings.removeThis);
    const primarySort = buildSortFunction(settings.primarySort, nameFunction);
    const secondSort = buildSortFunction(settings.secondarySort, nameFunction);
    const type = settings.tablesType;

    let data = type === TablesType.All ? settings.data :
        type === TablesType.Signatures ? settings.data.filter(filtering.keepSignatures) :
        type === TablesType.Fields ? settings.data.filter(filtering.keepFields) :
        type === TablesType.Skolems ? settings.data.filter(filtering.keepSkolems) :
        type === TablesType.Select ? settings.dataSelected.slice() : [];

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
                        {
                            item.expressionType() === 'signature' ?
                                SignatureHTMLTable({
                                    highlightSkolems: settings.highlightSkolems,
                                    signature: item as AlloySignature,
                                    skolemColors: settings.skolemColors
                                }) :
                            item.expressionType() === 'field' ?
                                FieldHTMLTable({
                                    field: item as AlloyField,
                                    highlightSkolems: settings.highlightSkolems,
                                    nameFunction: nameFunction,
                                    skolemColors: settings.skolemColors
                                }) :
                            item.expressionType() === 'skolem' ?
                                SkolemHTMLTable({
                                    nameFunction: nameFunction,
                                    skolem: item as AlloySkolem
                                }) :
                            null
                        }
                    </Card>
                ))
            }
        </div>
    );

};


function buildTableHeader (item: SigFieldSkolem, nameFunction: AlloyNameFn): React.ReactNode {

    if (item.expressionType() === 'signature') {
        return <SignatureTag
            fill={true}
            signature={item as AlloySignature}
            nameFunction={nameFunction}/>;
    }

    if (item.expressionType() === 'field') {
        return <FieldTag
            fill={true}
            field={item as AlloyField}
            nameFunction={nameFunction}/>;
    }

    if (item.expressionType() === 'skolem') {
        return <SkolemTag
            fill={true}
            skolem={item as AlloySkolem}
            nameFunction={nameFunction}/>;
    }

    return null;

}


export default connector(TableStage);
