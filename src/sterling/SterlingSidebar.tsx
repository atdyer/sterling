import { Button, Collapse } from '@blueprintjs/core';
import * as React from 'react';

export interface ISterlingSidebarSectionProps {
    collapsed: boolean,
    onToggleCollapse: () => void
    title?: string
}

class Section extends React.Component<ISterlingSidebarSectionProps> {

    render (): React.ReactNode {

        const collapseIcon = this.props.collapsed ? 'expand-all' : 'collapse-all';

        return (
            <div className={`section ${this.props.collapsed ? 'collapsed' : ''}`}>
                {
                    !!this.props.title &&
                    <div className='section-header'>
                        <div className='title'>
                            {this.props.title.toUpperCase()}
                        </div>
                        <Button
                            icon={collapseIcon}
                            minimal={true}
                            onClick={this.props.onToggleCollapse}/>
                    </div>
                }
                <Collapse
                    isOpen={!this.props.collapsed}
                    keepChildrenMounted={true}>
                    <div className='section-body'>
                        {this.props.children}
                    </div>
                </Collapse>
            </div>
        );

    }

}

export interface ISterlingSidebarProps {
    collapsed: boolean,
    onToggleCollapse: () => void,
    title: string
}

class SterlingSidebar extends React.Component<ISterlingSidebarProps> {

    static Section = Section;

    render(): React.ReactNode {

        const openIcon = 'menu-open';
        const closeIcon = 'menu-closed';

        if (this.props.collapsed) {
            return (
                <div className={`sterling-sidebar left collapsed`}>
                    <div className='header'>
                        <Button icon={openIcon} minimal={true} onClick={this.props.onToggleCollapse}/>
                    </div>
                </div>
            )
        }

        return (
            <div className={`sterling-sidebar left bp3-dark`}>
                <div className='header'>
                    <div className='title'>
                        {this.props.title}
                    </div>
                    <Button icon={closeIcon} minimal={true} onClick={this.props.onToggleCollapse}/>
                </div>
                {this.props.children}
            </div>
        )
    }

}

export default SterlingSidebar;
