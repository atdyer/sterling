import { Button, Collapse } from '@blueprintjs/core';
import React, { CSSProperties } from 'react';

interface ISectionProps {
    collapsed?: boolean
    onToggle?: () => void
    style?: CSSProperties
    title?: string
}

const Section: React.FunctionComponent<ISectionProps> = props => {

    const collapseIcon = props.collapsed ? 'expand-all' : 'collapse-all';

    return (
        <div
            className={`section ${props.collapsed ? 'collapsed' : ''}`}
            style={props.style}>
            {
                !!props.title &&
                <div className='header'>
                    <div className='title'>
                        {props.title.toUpperCase()}
                    </div>
                    {
                        props.onToggle && <Button
                            icon={collapseIcon}
                            minimal={true}
                            onClick={props.onToggle}/>
                    }
                </div>
            }
            <Collapse
                isOpen={!props.collapsed}
                keepChildrenMounted={true}>
                <div className='body'>
                    {props.children}
                </div>
            </Collapse>
        </div>
    );
};

class SterlingDrawer extends React.Component {

    static Section = Section;

    render (): React.ReactNode {

        return (
            <div className={'drawer'}>
                { this.props.children }
            </div>
        );

    }

}

export default SterlingDrawer;
