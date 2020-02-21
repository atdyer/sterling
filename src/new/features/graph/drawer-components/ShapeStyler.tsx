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
    COLOR_POPPER_MODIFIERS,
    DEFAULT_POPPER_COLORS
} from './util';



interface IShapeStyle {
    fill?: string
    stroke?: string
    strokeWidth?: number
    onChangeFill: (color: string) => void
    onChangeStroke: (color: string) => void
    onChangeStrokeWidth: (width: number | null) => void
}

const ShapeStyler: React.FunctionComponent<IShapeStyle> = props => {

    const fill = props.fill;
    const stroke = props.stroke;

    return (
        <>
            <FormGroup inline={true} label={'Fill'}>
                <Popover
                    hasBackdrop={true}
                    usePortal={true}
                    modifiers={COLOR_POPPER_MODIFIERS}
                    position={Position.LEFT}>
                    <Button
                        style={{
                            backgroundColor: background(fill),
                            color: foreground(fill)
                        }}
                        text={fill || 'Inheret'}
                        minimal={true}/>
                    <TwitterPicker
                        color={background(fill)}
                        colors={DEFAULT_POPPER_COLORS}
                        onChange={color => props.onChangeFill(color.hex)}
                        triangle={'hide'}/>
                </Popover>
            </FormGroup>
            <FormGroup inline={true} label={'Stroke'}>
                <Popover
                    hasBackdrop={true}
                    usePortal={true}
                    modifiers={COLOR_POPPER_MODIFIERS}
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
                        colors={DEFAULT_POPPER_COLORS}
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

export default ShapeStyler;
