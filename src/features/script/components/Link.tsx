import React from 'react';

interface ILinkProps {
    href: string
}

const Link: React.FunctionComponent<ILinkProps> = props => {
    // eslint-disable-next-line react/jsx-no-target-blank
    return <a href={props.href} target={'_blank'} rel={'noreferrer noopener'}>{ props.children }</a>
};

export default Link;
