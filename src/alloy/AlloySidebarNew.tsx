import { IconName, MaybeElement } from '@blueprintjs/core';
import React from 'react';

export interface SidebarItem {
    label: string,
    icon: IconName | MaybeElement
}

export interface IAlloySidebarNewProps {
    items: SidebarItem[]
    onClickItem: (item: string) => void
}

class AlloySidebarNew extends React.Component<IAlloySidebarNewProps> {

    render (): React.ReactNode {

        return null;
    }

}
