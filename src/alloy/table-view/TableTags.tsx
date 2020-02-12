import * as React from 'react';
import { AlloyField, AlloySignature, AlloySkolem } from 'alloy-ts';
import { Icon, Tag } from '@blueprintjs/core';
import { SigFieldSkolem } from '../../sterling/SterlingTypes';

export interface IAlloyTagProps {
    fill?: boolean,
    nameFunction?: (item: SigFieldSkolem) => string,
}

export interface ISignatureTagProps extends IAlloyTagProps {
    signature: AlloySignature | string
}

export interface IFieldTagProps extends IAlloyTagProps {
    field: AlloyField | string
}

export interface ISkolemTagProps extends IAlloyTagProps {
    skolem: AlloySkolem | string
}

class SignatureTag extends React.Component<ISignatureTagProps> {

    static className = 'sig-tag';

    render (): React.ReactNode {

        const props = this.props;

        const name = typeof props.signature === 'string'
            ? props.signature
            : props.nameFunction
                ? props.nameFunction(props.signature)
                : props.signature.name();

        return (
            <Tag className={SignatureTag.className} fill={props.fill}>
                { name }
            </Tag>
        );

    }

}

class FieldTag extends React.Component<IFieldTagProps> {

    static className = 'field-tag';

    render (): React.ReactNode {

        const name = typeof this.props.field === 'string'
            ? this.props.field
            : this.props.nameFunction
                ? this.props.nameFunction(this.props.field)
                : this.props.field.name();

        const tokens = name.split('<:');

        return (
            <Tag
                className={FieldTag.className}
                fill={this.props.fill}>
                { FieldTag.FieldTagEls(tokens) }
            </Tag>
        )

    }

    public static FieldTagEls (tokens: Array<string>): React.ReactElement {

        if (tokens.length !== 2)
            return <>{tokens.join('')}</>;

        return (<>
            {tokens[0]}
            <Icon
                icon='symbol-triangle-down'
                iconSize={14}
                style={{
                    padding: '0 1px 0 1px',
                    transform: 'rotate(90deg)'
                }}/>
            {tokens[1]}
        </>);

    }

}

class SkolemTag extends React.Component<ISkolemTagProps> {

    static className = 'skolem-tag';

    render (): React.ReactNode {

        const props = this.props;

        const name = typeof props.skolem === 'string'
            ? props.skolem
            : props.nameFunction
                ? props.nameFunction(props.skolem)
                : props.skolem.name();

        return (
            <Tag className={SkolemTag.className} fill={props.fill}>
                { name }
            </Tag>

        );

    }

}

export {
    SignatureTag,
    FieldTag,
    SkolemTag
}
