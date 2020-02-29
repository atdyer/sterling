import { Card, NonIdealState } from '@blueprintjs/core';
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
    ...state.tableSlice,
    description: state.sterlingSlice.welcomeDescription,
    instance: state.alloySlice.instance,
    title: state.sterlingSlice.welcomeTitle
});

// Create connector
const connector = connect(mapState);

// Create props for things from redux
type TableStageProps = ConnectedProps<typeof connector>;

// The table stage component
const TableStage: React.FunctionComponent<TableStageProps> = props => {

    if (!props.instance) return (
        <NonIdealState
            title={props.title}
            description={props.description}
            icon={'th'}/>
    );

    const alignment = getAlignClass(props.alignment);
    const direction = getLayoutClass(props.layoutDirection);
    const nameFunction = buildNameFunction(props.removeThis);
    const primarySort = buildSortFunction(props.primarySort, nameFunction);
    const secondSort = buildSortFunction(props.secondarySort, nameFunction);
    const type = props.tablesType;

    let data = type === TablesType.All ? props.data :
        type === TablesType.Signatures ? props.data.filter(filtering.keepSignatures) :
        type === TablesType.Fields ? props.data.filter(filtering.keepFields) :
        type === TablesType.Skolems ? props.data.filter(filtering.keepSkolems) :
        type === TablesType.Select ? props.dataSelected.slice() : [];

    const pass = () => true;
    data = type === TablesType.Select
        ? data
        : data
            .filter(props.removeBuiltin ? filtering.removeBuiltins : pass)
            .filter(props.removeEmpty ? filtering.removeEmptys : pass)
            .filter(props.highlightSkolems ? filtering.removeSkolems : pass);

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
                                    highlightSkolems: props.highlightSkolems,
                                    signature: item as AlloySignature,
                                    skolemColors: props.skolemColors
                                }) :
                            item.expressionType() === 'field' ?
                                FieldHTMLTable({
                                    field: item as AlloyField,
                                    highlightSkolems: props.highlightSkolems,
                                    nameFunction: nameFunction,
                                    skolemColors: props.skolemColors
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
