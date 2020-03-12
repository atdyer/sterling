import {
    Button,
    FormGroup,
    NumericInput,
    Popover,
    Position
} from '@blueprintjs/core';
import React from 'react';
import { TwitterPicker } from 'react-color';
import {
    background,
    foreground,
    POPPER_MODIFIERS,
    DEFAULT_COLORS
} from '../../../util';

interface IShapeStyle {
    fill?: string
    stroke?: string
    strokeWidth?: number
    onChangeFill: (color: string|null) => void
    onChangeStroke: (color: string|null) => void
    onChangeStrokeWidth: (width: string) => void
}

const ShapeStyler: React.FunctionComponent<IShapeStyle> = props => {

    const fill = props.fill;
    const stroke = props.stroke;

    return (
        <>
            <FormGroup inline={true} label={'Fill'}>
                {
                    fill &&
                    <Button
                        icon={'small-cross'}
                        onClick={() => props.onChangeFill(null)}
                        minimal={true}/>
                }
                <Popover
                    hasBackdrop={true}
                    usePortal={true}
                    modifiers={POPPER_MODIFIERS}
                    position={Position.LEFT}>
                    <Button
                        style={{
                            backgroundColor: background(fill),
                            color: foreground(fill)
                        }}
                        text={fill || 'Inherit'}
                        minimal={true}/>
                    <TwitterPicker
                        color={background(fill)}
                        colors={DEFAULT_COLORS}
                        onChange={color => props.onChangeFill(color.hex)}
                        triangle={'hide'}/>
                </Popover>
            </FormGroup>
            <FormGroup inline={true} label={'Stroke'}>
                {
                    stroke &&
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
                    min={-1}
                    onValueChange={(_, strVal) => props.onChangeStrokeWidth(strVal)}
                    placeholder={'Inherit'}
                    value={props.strokeWidth}/>
            </FormGroup>
        </>
    );
};

export default ShapeStyler;
