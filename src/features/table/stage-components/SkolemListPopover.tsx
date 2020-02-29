import { AlloySkolem } from 'alloy-ts';
import React from 'react';

export default function SkolemListPopover (skolems: AlloySkolem[], colors: string[]): React.ReactElement {

    return (
        <>
            {
                skolems.map((skolem: AlloySkolem, i: number) => {
                    return (
                        <div key={skolem.id()}
                             style={{backgroundColor: colors[i]}}>
                            { skolem.name() }
                        </div>
                    )
                })
            }
        </>
    )

}
