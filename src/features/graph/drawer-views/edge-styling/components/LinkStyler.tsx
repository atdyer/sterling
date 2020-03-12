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
    onChangeStroke: (color: string | null) => void
    onChangeStrokeWidth: (width: string) => void
}

const LinkStyler: React.FunctionComponent<ILinkStyle> = props => {

    const stroke = props.stroke;

    return (
        <>
            <FormGroup inline={true} label={'Stroke'}>
                {
                    props.stroke &&
                    <Button
                        icon={'small-cross'}
                        onClick={() => props.onChangeStroke(null)}
                        minimal={true}/>
                }
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
                        text={stroke || 'Inherit'}
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
                    onValueChange={(_, strVal) => props.onChangeStrokeWidth(strVal)}
                    placeholder={'Inherit'}
                    value={props.strokeWidth}/>
            </FormGroup>
        </>
    );

};

export default LinkStyler;
