import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../rootReducer';
import {
    setGraphView,
    setMainView,
    setTableView
} from './sterlingSlice';

// Map redux state to sidebar props
const mapState = (state: RootState) => ({
    ...state.sterlingSlice,
});

// Actions
const mapDispatch = {
    setGraphView,
    setMainView,
    setTableView
};

// Connect the two
const connector = connect(
    mapState,
    mapDispatch
);

// Create props
export type SterlingSidebarProps = ConnectedProps<typeof connector>;

// The sidebar view
const SterlingSidebar: React.FunctionComponent<SterlingSidebarProps> = props => {

    const mainview = props.mainView;
    const evalActive =
        (mainview === 'graph' && props.graphView === 'evaluator') ||
        (mainview === 'table' && props.tableView === 'evaluator');

    return (
        <div className={'sidebar nav bp3-dark'}>
            {
                mainview === 'graph' ? <GraphSidebar {...props}/> :
                mainview === 'table' ? <TableSidebar {...props}/> :
                null
            }
            <div className={'divider'}/>
            <Tooltip
                content={<span>Evaluator</span>}
                hoverOpenDelay={500}
                intent={Intent.PRIMARY}
                position={Position.RIGHT}>
                <Button
                    icon={'console'}
                    minimal={true}
                    large={true}
                    active={evalActive}
                    onClick={() => {
                        if (mainview === 'graph') props.setGraphView('evaluator');
                        if (mainview === 'table') props.setTableView('evaluator');
                    }}/>
            </Tooltip>
        </div>
    );

};

// The graph sidebar section
const GraphSidebar: React.FunctionComponent<SterlingSidebarProps> = props => {

    const view = props.graphView;

    return (
        <>
            <Tooltip
                content={<span>Graph Settings</span>}
                hoverOpenDelay={500}
                intent={Intent.PRIMARY}
                position={Position.RIGHT}>
                <Button
                    icon={'settings'}
                    minimal={true}
                    large={true}
                    active={view === 'settings'}
                    onClick={() => props.setGraphView('settings')}/>
            </Tooltip>
            <Tooltip
                content={<span>Projections and Layout</span>}
                hoverOpenDelay={500}
                intent={Intent.PRIMARY}
                position={Position.RIGHT}>
                <Button
                    active={view === 'layout'}
                    icon={'layout-auto'}
                    minimal={true}
                    large={true}
                    onClick={() => props.setGraphView('layout')}/>
            </Tooltip>
            <Tooltip
                content={<span>Node Styling</span>}
                hoverOpenDelay={500}
                intent={Intent.PRIMARY}
                position={Position.RIGHT}>
                <Button
                    active={view === 'node'}
                    icon={'heatmap'}
                    minimal={true}
                    large={true}
                    onClick={() => props.setGraphView('node')}/>
            </Tooltip>
            <Tooltip
                content={<span>Edge Styling</span>}
                hoverOpenDelay={500}
                intent={Intent.PRIMARY}
                position={Position.RIGHT}>
                <Button
                    active={view === 'edge'}
                    icon={'flows'}
                    minimal={true}
                    large={true}
                    onClick={() => props.setGraphView('edge')}/>
            </Tooltip>
        </>
    );

};

const TableSidebar: React.FunctionComponent<SterlingSidebarProps> = props => {
    return (
        <Tooltip
            content={<span>View Settings</span>}
            hoverOpenDelay={500}
            intent={Intent.PRIMARY}
            position={Position.RIGHT}>
            <Button
                icon={'settings'}
                minimal={true}
                large={true}
                active={props.tableView === 'settings'}
                onClick={() => props.setTableView('settings')}/>
        </Tooltip>
    );
};

export default connector(SterlingSidebar);
