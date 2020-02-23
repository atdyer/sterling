import { Button, FormGroup, NumericInput, Popover } from '@blueprintjs/core';
import { Position } from '@blueprintjs/core/lib/esm/common/position';
import React from 'react';
import { TwitterPicker } from 'react-color';
import {
    background,
    DEFAULT_COLORS,
    foreground,
    POPPER_MODIFIERS
} from '../../../util';

interface ILinkStyle {
    stroke?: string
    strokeWidth?: number
    onChangeStroke: (color: string) => void
    onChangeStrokeWidth: (width: number | null) => void
}

const LinkStyler: React.FunctionComponent<ILinkStyle> = props => {

    const stroke = props.stroke;

    return (
        <>
            <FormGroup inline={true} label={'Stroke'}>
                <Popover
                    hasBackdrop={true}
                    usePortal={true}
                    modifiers={POPPER_MODIFIERS}
                    position={Position.LEFT}>
                    <Button
                        style={{
                            backgroundColor: background(stroke),
                            color: foreground(stroke)
                        }}
                        text={stroke || 'Inheret'}
                        minimal={true}/>
                    <TwitterPicker
                        color={background(stroke)}
                        colors={DEFAULT_COLORS}
                        onChange={color => props.onChangeStroke(color.hex)}
                        triangle={'hide'}/>
                </Popover>
            </FormGroup>
            <FormGroup inline={true} label={'Stroke Width'}>
                <NumericInput
                    allowNumericCharactersOnly={true}
                    fill={false}
                    min={0}
                    onValueChange={(number, string) => {
                        props.onChangeStrokeWidth(string.length ? number : null)
                    }}
                    placeholder={'Inheret'}
                    value={props.strokeWidth}/>
            </FormGroup>
        </>
    );

};

export default LinkStyler;