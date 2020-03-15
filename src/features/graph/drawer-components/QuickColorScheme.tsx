import { Button, ButtonGroup, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { backgroundGradient, COLOR_SCHEMES } from '../util';

interface QuickColorSchemeProps {
    onClick: (scheme: string[]) => void
}

const QuickColorScheme: React.FunctionComponent<QuickColorSchemeProps> = props => (
    <ButtonGroup minimal={true} style={{
        flexWrap: 'wrap',
        maxHeight: '15px',
        overflow: 'hidden'
    }}>
        {
            COLOR_SCHEMES.map(([name, scheme]) => (
                <Tooltip content={name} key={name}>
                    <Button minimal={true} style={{
                        background: backgroundGradient(scheme.slice(0, 6)),
                        margin: '0 5px',
                        minWidth: '40px',
                        minHeight: '15px'
                    }} onClick={() => props.onClick(scheme)}/>
                </Tooltip>
            ))
        }
    </ButtonGroup>
);

export default QuickColorScheme;
