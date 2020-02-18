import * as d3 from 'd3';
import {
    Button,
    FormGroup,
    NumericInput,
    Popover,
    Position
} from '@blueprintjs/core';
import React from 'react';
import { TwitterPicker } from 'react-color';

const DEFAULT_COLORS = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5",
    "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39",
    "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b",
    "#333333", "#777777", "#bbbbbb", "#ffffff"];

const POPPER_MODIFIERS = {
    preventOverflow: {
        enabled: false
    },
    hide: {
        enabled: false
    }
};

function background (color?: string | null): string | undefined {
    if (!color) return;
    const c = d3.color(color);
    return c ? c.hex() : undefined;
}

function foreground (color?: string | null): string | undefined {
    if (!color) return;
    const c = d3.color(color);
    if (!c) return;
    const rgb = c.rgb();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 125
        ? '#000000'
        : '#ffffff';
}

interface IShapeAttributeSelector {
    fill?: string
    stroke?: string
    strokeWidth?: number
    onChangeFill: (color: string) => void
    onChangeStroke: (color: string) => void
    onChangeStrokeWidth: (width: number | null) => void
}

const ShapeAttributeSelector: React.FunctionComponent<IShapeAttributeSelector> = props => {

    const fill = props.fill;
    const stroke = props.stroke;

    return (
        <>
            <FormGroup inline={true} label={'Fill'}>
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
                        text={fill || 'Inheret'}
                        minimal={true}/>
                    <TwitterPicker
                        color={background(fill)}
                        colors={DEFAULT_COLORS}
                        onChange={color => props.onChangeFill(color.hex)}
                        triangle={'hide'}/>
                </Popover>
            </FormGroup>
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

export default ShapeAttributeSelector;
