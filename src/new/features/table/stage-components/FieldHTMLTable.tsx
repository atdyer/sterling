import { HTMLTable } from '@blueprintjs/core';
import {
    AlloyAtom,
    AlloyField,
    AlloySignature,
    AlloySkolem,
    AlloyTuple
} from 'alloy-ts';
import React from 'react';
import PopoverRow from './PopoverRow';
import SkolemListPopover from './SkolemListPopover';


interface IFieldHTMLTableProps {
    field: AlloyField,
    highlightSkolems: boolean,
    nameFunction: (item: AlloySignature | AlloyField | AlloySkolem) => string,
    skolemColors: Map<AlloySkolem, string>
}

export default function FieldHTMLTable (props: IFieldHTMLTableProps) {

    const types: AlloySignature[] = props.field.types();
    const tuples: AlloyTuple[] = props.field.tuples();

    return (
        <HTMLTable
            bordered={true}
            condensed={true}
            striped={true}>
            <thead>
            <tr>
            {
                types.map((sig: AlloySignature, i: number) => (
                    <th key={sig.id() + i}>
                        {props.nameFunction(sig)}
                    </th>
                ))
            }
            </tr>
            </thead>
            <tbody>
            {
                tuples.map((tuple: AlloyTuple) => {

                    const skolems = tuple.skolems();

                    if (props.highlightSkolems && skolems.length) {

                        const colors = skolems.map(s => props.skolemColors.get(s) || '');

                        return (
                            <PopoverRow
                                key={tuple.id()}
                                content={SkolemListPopover(skolems, colors)}
                                colors={colors}>
                                {
                                    tuple.atoms().map((atom: AlloyAtom, i: number) => (
                                        <td key={tuple.id() + '[' + i + ']'}>
                                            {atom.name()}
                                        </td>
                                    ))
                                }
                            </PopoverRow>
                        );

                    } else {

                        return (
                            <tr key={tuple.id()}>
                                {
                                    tuple.atoms().map((atom: AlloyAtom, i: number) => (
                                        <td key={tuple.id() + '[' + i + ']'}>
                                            {atom.name()}
                                        </td>
                                    ))
                                }
                            </tr>
                        )

                    }

                })
            }
            </tbody>
        </HTMLTable>
    )

}
