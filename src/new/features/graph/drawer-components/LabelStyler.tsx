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
    POPPER_MODIFIERS,
    DEFAULT_COLORS,
    foreground
} from '../util';

interface ILabelStyle {
    color?: string
    size?: number
    onChangeColor: (color: string | null) => void
    onChangeSize: (size: string) => void
}

const LabelStyler: React.FunctionComponent<ILabelStyle> = props => {

    return (
        <>
            <FormGroup inline={true} label={'Label Size (px)'}>
                <NumericInput
                    allowNumericCharactersOnly={true}
                    fill={false}
                    min={0}
                    minorStepSize={null}
                    onValueChange={(_, strVal) => props.onChangeSize(strVal)}
                    placeholder={'Inheret'}
                    value={props.size}/>
            </FormGroup>
            <FormGroup inline={true} label={'Label Color'}>
                {
                    props.color &&
                    <Button
                        icon={'small-cross'}
                        onClick={() => props.onChangeColor(null)}
                        minimal={true}/>
                }
                <Popover
                    hasBackdrop={true}
                    usePortal={true}
                    modifiers={POPPER_MODIFIERS}
                    position={Position.LEFT}>
                    <Button
                        style={{
                            backgroundColor: background(props.color),
                            color: foreground(props.color)
                        }}
                        text={props.color || 'Inheret'}
                        minimal={true}/>
                    <TwitterPicker
                        color={background(props.color)}
                        colors={DEFAULT_COLORS}
                        onChange={color => props.onChangeColor(color.hex)}
                        triangle={'hide'}/>
                </Popover>
            </FormGroup>
        </>
    );

};

export default LabelStyler;
