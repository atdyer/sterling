import {
    Button,
    IconName, Intent,
    MaybeElement,
    Position,
    Tooltip
} from '@blueprintjs/core';
import React from 'react';
import { SideView } from './SterlingTypes';

export interface ISterlingSidebarItem {

    view: SideView
    icon: IconName | MaybeElement
    label: string

}

export interface ISterlingSidebarProps {

    items: ISterlingSidebarItem[]
    view: SideView
    onPickView: (view: SideView) => void

}

class SterlingSidebar extends React.Component<ISterlingSidebarProps> {

    render (): React.ReactNode {

        const props = this.props;

        return (
            <div className={'sidebar nav bp3-dark'}>
                {
                    props.items.map((item, i) => (
                        <Tooltip
                            key={i}
                            content={<span>{item.label}</span>}
                            hoverOpenDelay={500}
                            intent={Intent.PRIMARY}
                            position={Position.RIGHT}
                        >
                            <Button
                                icon={item.icon}
                                minimal={true}
                                large={true}
                                active={props.view === item.view}
                                onClick={() => this._onClick(item.view)}
                            />
                        </Tooltip>
                    ))
                }
            </div>
        )

    }

    private _onClick = (view: SideView): void => {

        const props = this.props;

        if (view === props.view)
            props.onPickView(null);
        else
            props.onPickView(view);

    }

}

export default SterlingSidebar;
