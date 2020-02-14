import { Button, Icon, Tab, Tabs } from '@blueprintjs/core';
import React from 'react';
import { ISterlingSidebarProps } from '../sterling/SterlingSidebar';
import { Evaluator } from '../new/evaluator/Evaluator';
import EvaluatorView from './evaluator/EvaluatorView';

export interface IAlloySidebarProps extends ISterlingSidebarProps {
    evaluator: Evaluator
    onRequestSidebarView: (view: 'settings' | 'evaluator') => void
    view: 'settings' | 'evaluator'
}

class AlloySidebar extends React.Component<IAlloySidebarProps> {

    render (): React.ReactNode {

        const openIcon = 'menu-open';
        const closeIcon = 'menu-closed';

        if (this.props.collapsed) {
            return (
                <div className={`alloy-sidebar left collapsed`}>
                    <div className='header'>
                        <Button icon={openIcon}
                                minimal={true}
                                onClick={this.props.onToggleCollapse}
                        />
                    </div>
                </div>
            )
        }

        return <Tabs id={'alloy-sidebar'}
                     animate={false}
                     className={'alloy-sidebar left bp3-dark'}
                     selectedTabId={this.props.view}
                     onChange={this._handleTabChange}>
            <Tab id={'settings'}
                 title={<><Icon icon={'cog'}/>Settings</>}
                 panel={<>{this.props.children}</>}
                 panelClassName={'sidebar-pane'}
            />
            <Tab id={'evaluator'}
                 title={<><Icon icon={'console'}/>Evaluator</>}
                 panel={<EvaluatorView evaluator={this.props.evaluator}/>}
                 panelClassName={'sidebar-pane'}
            />
            <Tabs.Expander/>
            <Button icon={closeIcon}
                    minimal={true}
                    onClick={this.props.onToggleCollapse}
            />
        </Tabs>

    }

    private _handleTabChange = (id: 'settings' | 'evaluator'): void => {
        this.props.onRequestSidebarView(id);
    }

}

export default AlloySidebar;
