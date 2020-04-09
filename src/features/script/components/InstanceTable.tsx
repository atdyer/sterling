import { HTMLTable } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../rootReducer';
import Link from './Link';

const mapState = (state: RootState) => ({
    instance: state.scriptSlice.instance
});

const connector = connect(mapState);

type InstanceTableProps = ConnectedProps<typeof connector>;

const InstanceTable: React.FunctionComponent<InstanceTableProps> = props => (
    <HTMLTable className={'fill'} condensed={true} striped={true}>
        <thead>
        <tr>
            <th scope={'col'}>Variable</th>
            <th scope={'col'}>Type</th>
        </tr>
        </thead>
        <tbody>
        {
            props.instance && (
                <>
                    <tr>
                        <td>instance</td>
                        <td><Link href={'https://alloy-js.github.io/alloy-ts/classes/alloyinstance.html'}>AlloyInstance</Link></td>
                    </tr>
                    {
                        props.instance.signatures()
                            .sort(varSort)
                            .map(signature => (
                            <tr key={varName(signature)}>
                                <td>{varName(signature)}</td>
                                <td><Link href={'https://alloy-js.github.io/alloy-ts/classes/alloysignature.html'}>AlloySignature</Link></td>
                            </tr>
                        ))
                    }
                    {
                        props.instance.atoms()
                            .sort(varSort)
                            .filter(atom => isNaN(+atom.id()))
                            .map(atom => (
                            <tr key={varName(atom)}>
                                <td>{varName(atom)}</td>
                                <td><Link href={'https://alloy-js.github.io/alloy-ts/classes/alloyatom.html'}>AlloyAtom</Link></td>
                            </tr>
                        ))
                    }
                    {
                        props.instance.fields()
                            .sort(varSort)
                            .map(field => (
                            <tr key={varName(field)}>
                                <td>{varName(field)}</td>
                                <td><Link href={'https://alloy-js.github.io/alloy-ts/classes/alloyfield.html'}>AlloyField</Link></td>
                            </tr>
                        ))
                    }
                    {
                        props.instance.skolems()
                            .sort(varSort)
                            .map(skolem => (
                            <tr key={varName(skolem)}>
                                <td>{varName(skolem)}</td>
                                <td><Link href={'https://alloy-js.github.io/alloy-ts/classes/alloyskolem.html'}>AlloySkolem</Link></td>
                            </tr>
                        ))
                    }
                </>
            )
        }
        </tbody>
    </HTMLTable>
);

// function instanceVariables (instance: AlloyInstance): [string[], any[]] {
//
//     const sigs = instance.signatures(true);
//     const atoms = instance.atoms(true).filter(atom => isNaN(+atom.id()));
//     const fields = instance.fields(true);
//     const skolems = instance.skolems(true);
//
//     return [[
//         ...sigs.map(varName),
//         ...atoms.map(varName),
//         ...fields.map(varName),
//         ...skolems.map(varName)
//     ], [
//         ...sigs,
//         ...atoms,
//         ...fields,
//         ...skolems
//     ]];
//
// }

function varName (item: any): string {
    return Reflect.get(item, '__var__');
}

function varSort (a: any, b: any): number {
    const aid = a.id().toUpperCase();
    const bid = b.id().toUpperCase();
    if (aid < bid) return -1;
    if (aid > bid) return 1;
    return 0;
}

export default connector(InstanceTable);
