import { CircleStyle, RectangleStyle } from '@atdyer/graph-js';
import { FormGroup, HTMLSelect, NumericInput } from '@blueprintjs/core';
import React from 'react';
import { SignatureStyle } from '../graphTypes';

interface IShapeSelector {
    style: SignatureStyle
    onSetHeight: (height: number) => void
    onSetRadius: (radius: number) => void
    onSetShape: (shape: 'circle' | 'rectangle' | null) => void
    onSetWidth: (width: number) => void
}

const ShapeSelector: React.FunctionComponent<IShapeSelector> = props => {

    const style = props.style;
    const type = style ? style.type : 'inheret';

    const options = [
        { value: 'inheret', label: 'Inheret' },
        { value: 'circle', label: 'Circle' },
        { value: 'rectangle', label: 'Rectangle' }
    ];

    return (
        <>
            <FormGroup inline={true} label={'Shape'}>
                <HTMLSelect
                    options={options}
                    value={type}
                    onChange={event => {
                        let value = event.target.value;
                        props.onSetShape(valueToShape(value));
                    }}
                />
            </FormGroup>
            {
                type === 'circle' ?
                    <CircleProps
                        style={style as CircleStyle}
                        onSetRadius={props.onSetRadius}/> :
                type === 'rectangle' ?
                    <RectangleProps
                        style={style as RectangleStyle}
                        onSetWidth={props.onSetWidth}
                        onSetHeight={props.onSetHeight}/> :
                null
            }
        </>
    )
};

interface ICircleProps {
    style: CircleStyle
    onSetRadius: (radius: number) => void
}
const CircleProps: React.FunctionComponent<ICircleProps> = props => {
    const radius = props.style.radius;
    return (
        <FormGroup inline={true} label={'Radius'}>
            <NumericInput
                allowNumericCharactersOnly={true}
                min={1}
                onValueChange={props.onSetRadius}
                placeholder={radius ? radius.toString() : ''}
                value={radius}/>
        </FormGroup>
    )
};

interface IRectangleProps {
    style: RectangleStyle,
    onSetHeight: (height: number) => void
    onSetWidth: (width: number) => void
}
const RectangleProps: React.FunctionComponent<IRectangleProps> = props => {
    const width = props.style.width;
    const height = props.style.height;
    return <>
        <FormGroup inline={true} label={'Width'}>
            <NumericInput
                allowNumericCharactersOnly={true}
                min={1}
                onValueChange={props.onSetWidth}
                placeholder={width ? width.toString() : ''}
                value={width}
                />
        </FormGroup>
        <FormGroup inline={true} label={'Height'}>
            <NumericInput
                allowNumericCharactersOnly={true}
                min={1}
                onValueChange={props.onSetHeight}
                placeholder={height ? height.toString() : ''}
                value={height}
            />
        </FormGroup>
    </>;
};

function valueToShape (value: string): (null | 'circle' | 'rectangle') {
    if (value === 'circle' || value === 'rectangle') return value;
    return null;
}

export default ShapeSelector;