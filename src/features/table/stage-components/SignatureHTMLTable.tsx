import { HTMLTable } from '@blueprintjs/core';
import { AlloyAtom, AlloySignature, AlloySkolem } from 'alloy-ts';
import React from 'react';
import PopoverRow from './PopoverRow';
import SkolemListPopover from './SkolemListPopover';

export interface ISignatureHTMLTableProps {
    highlightSkolems: boolean,
    signature: AlloySignature,
    skolemColors: Map<AlloySkolem, string>
}

export default function SignatureHTMLTable (props: ISignatureHTMLTableProps) {

    const signature = props.signature;
    const atoms: AlloyAtom[] = signature.atoms();

    return (
        <HTMLTable
            bordered={true}
            condensed={true}
            striped={true}>
            <tbody>
            {
                atoms.map((atom: AlloyAtom) => {

                    const skolems = atom.skolems();

                    if (props.highlightSkolems && skolems.length) {

                        const colors = skolems.map(s => props.skolemColors.get(s) || '');

                        return (
                            <PopoverRow
                                key={atom.id()}
                                content={SkolemListPopover(skolems, colors)}
                                colors={colors}>
                                <td>{ atom.name() }</td>
                            </PopoverRow>
                        );

                    } else {

                        return (
                            <tr key={atom.id()}>
                                <td>{ atom.name() }</td>
                            </tr>
                        );

                    }
                })
            }
            </tbody>
        </HTMLTable>
    )
}
