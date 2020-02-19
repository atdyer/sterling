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
    COLOR_POPPER_MODIFIERS,
    DEFAULT_POPPER_COLORS,
    foreground
} from './util';

interface ILabelStyle {
    color?: string
    size?: number
    onChangeColor: (color: string) => void
    onChangeSize: (size: number | null) => void
}

const LabelStyler: React.FunctionComponent<ILabelStyle> = props => {

    return (
        <>
            <FormGroup inline={true} label={'Label Size (px)'}>
                <NumericInput
                    allowNumericCharactersOnly={true}
                    fill={false}
                    min={1}
                    minorStepSize={null}
                    onValueChange={props.onChangeSize}
                    placeholder={'Inheret'}
                    value={props.size}/>
            </FormGroup>
            <FormGroup inline={true} label={'Label Color'}>
                <Popover
                    hasBackdrop={true}
                    usePortal={true}
                    modifiers={COLOR_POPPER_MODIFIERS}
                    position={Position.RIGHT}>
                    <Button
                        style={{
                            backgroundColor: background(props.color),
                            color: foreground(props.color)
                        }}
                        text={props.color || 'Inheret'}
                        minimal={true}/>
                    <TwitterPicker
                        color={background(props.color)}
                        colors={DEFAULT_POPPER_COLORS}
                        onChange={color => props.onChangeColor(color.hex)}
                        triangle={'hide'}/>
                </Popover>
            </FormGroup>
        </>
    );

};

export default LabelStyler;
