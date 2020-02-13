import { Button } from '@blueprintjs/core';
import React from 'react';
import { ISterlingSidebarProps } from '../sterling/SterlingSidebar';
import { Evaluator } from './evaluator/Evaluator';
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
        const props = this.props;

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
                    <div className={'group'}>
                        <Button active={props.view === 'settings'}
                                icon={'cog'}
                                minimal={true}
                                onClick={this._requestSettings}
                                text={this.props.title}/>
                        <Button active={props.view === 'evaluator'}
                                icon={'console'}
                                minimal={true}
                                onClick={this._requestEvaluator}
                                text={'Evaluator'}/>
                    </div>
                    <div className={'group'}>
                        <Button icon={closeIcon} minimal={true} onClick={this.props.onToggleCollapse}/>
                    </div>
                </div>
                {
                    props.view === 'settings'
                        ? this.props.children
                        : <EvaluatorView evaluator={props.evaluator}/>
                }
            </div>
        )

    }

    private _requestEvaluator = () => {
        this.props.onRequestSidebarView('evaluator');
    };

    private _requestSettings = () => {
        this.props.onRequestSidebarView('settings');
    }

}

export default AlloySidebar;
