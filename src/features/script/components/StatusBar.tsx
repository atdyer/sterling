import React from 'react';
import { ScriptStatus } from '../scriptSlice';

interface IStatusBarProps {
    status: ScriptStatus
}

const StatusBar: React.FunctionComponent<IStatusBarProps> = props => {
    return (
        <div className={`status-bar ${props.status}`}/>
    )
};

export default StatusBar;
