import { Portal } from '@blueprintjs/core';
import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

interface IPopoverRowProps {
    content: string | React.ReactElement,
    colors: string[]
}

interface IPopoverRowState {
    enabled: boolean
}

export default class PopoverRow extends React.Component<IPopoverRowProps, IPopoverRowState> {

    public state = {
        enabled: false
    };

    render (): React.ReactNode {

        const colors = this.props.colors;
        const thickness = this.state.enabled ? 4 : 2;

        return (
            <Manager>
                <Reference>
                    {({ ref }) => (
                        <tr onMouseEnter={this._onMouseEnter}
                            onMouseLeave={this._onMouseLeave}
                            ref={ref}
                            style={{
                                boxShadow: this._buildShadowStyle(colors, thickness)
                            }}>
                            {this.props.children}
                        </tr>
                    )}
                </Reference>
                <Portal>
                    <Popper
                        modifiers={{}}
                        placement='right'>
                        {({ ref, style, placement }) => (
                            this.state.enabled &&
                            <div
                                ref={ref}
                                style={{
                                    ...style,
                                    padding: (thickness * (colors.length - 1)) + 'px'
                                }}
                                data-placement={placement}>
                                <div className='table-rowpop'>
                                    {this.props.content}
                                </div>
                            </div>
                        )}
                    </Popper>
                </Portal>
            </Manager>
        );

    }

    private _buildShadowStyle = (colors: string[], thickness: number): string => {
        return colors.map((color: string, i: number) => {
            return `0 0 0 ${(i+1) * thickness}px ${color}`
        }).join(',');
    };

    private _onMouseEnter = () => {
        this.setState({enabled: true});
    };

    private _onMouseLeave = () => {
        this.setState({enabled: false});
    };

}
