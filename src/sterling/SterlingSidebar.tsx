import {
    Button,
    IconName,
    Intent,
    MaybeElement,
    Position,
    Tooltip
} from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../rootReducer';
import {
    setGraphView,
    setMainView,
    setSourceView,
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
    setSourceView,
    setTableView
};

// Connect the two
const connector = connect(
    mapState,
    mapDispatch
);

// Create props
export type SterlingSidebarProps = ConnectedProps<typeof connector>;

// Sidebar button component props
interface SidebarButtonProps {
    active: boolean
    click: () => void
    icon: IconName | MaybeElement
    text: string
}

// A sidebar button
const SidebarButton: React.FunctionComponent<SidebarButtonProps> = props => (
    <Tooltip
        content={<span>{props.text}</span>}
        hoverOpenDelay={500}
        intent={Intent.PRIMARY}
        position={Position.RIGHT}>
        <Button
            icon={props.icon}
            minimal={true}
            large={true}
            active={props.active}
            onClick={props.click}/>
    </Tooltip>
);

// The sidebar view
const SterlingSidebar: React.FunctionComponent<SterlingSidebarProps> = props => {

    const mainview = props.mainView;
    const evalActive =
        (mainview === 'graph' && props.graphView === 'evaluator') ||
        (mainview === 'table' && props.tableView === 'evaluator') ||
        (mainview === 'source' && props.sourceView === 'evaluator');

    return (
        <div className={'sidebar nav bp3-dark'}>
            {
                mainview === 'graph' ? <GraphSidebar {...props}/> :
                mainview === 'table' ? <TableSidebar {...props}/> :
                mainview === 'source' ? <SourceSidebar {...props}/> :
                null
            }
            <div className={'divider'}/>
            <SidebarButton
                active={evalActive}
                click={() => {
                    if (mainview === 'graph') props.setGraphView('evaluator');
                    if (mainview === 'table') props.setTableView('evaluator');
                    if (mainview === 'source') props.setSourceView('evaluator');
                }}
                icon={'console'}
                text={'Evaluator'}/>
        </div>
    );

};

// The graph sidebar section
const GraphSidebar: React.FunctionComponent<SterlingSidebarProps> = props => {

    const view = props.graphView;

    return (
        <>
            <SidebarButton
                active={view === 'node'}
                click={() => props.setGraphView('node')}
                icon={'group-objects'}
                text={'Projections and Node Styling'}/>
            <SidebarButton
                active={view === 'edge'}
                click={() => props.setGraphView('edge')}
                icon={'flows'}
                text={'Edge Styling'}/>
            <SidebarButton
                active={view === 'layout'}
                click={() => props.setGraphView('layout')}
                icon={'layout-auto'}
                text={'Layout'}/>
            <SidebarButton
                active={view === 'settings'}
                click={() => props.setGraphView('settings')}
                icon={'settings'}
                text={'Graph Settings'}/>
        </>
    );

};

const TableSidebar: React.FunctionComponent<SterlingSidebarProps> = props => {
    return (
        <SidebarButton
            active={props.tableView === 'settings'}
            click={() => props.setTableView('settings')}
            icon={'settings'}
            text={'Table Settings'}/>
    );
};

const SourceSidebar: React.FunctionComponent<SterlingSidebarProps> = props => {
    return (
        <SidebarButton
            active={props.sourceView === 'files'}
            click={() => props.setSourceView('files')}
            icon={'document'}
            text={'Model Sources'}/>
    )
};

export default connector(SterlingSidebar);
