import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../rootReducer';
import { selectSideView } from './sterlingSlice';

// Map redux state to sidebar props
const mapState = (state: RootState) => ({
    view: state.sterlingSlice.sideView
});

// Actions
const mapDispatch = {
    selectSideView
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

    return (
        <div className={'sidebar nav bp3-dark'}>
            <Tooltip
                content={<span>View Settings</span>}
                hoverOpenDelay={500}
                intent={Intent.PRIMARY}
                position={Position.RIGHT}
            >
                <Button
                    icon={'settings'}
                    minimal={true}
                    large={true}
                    active={props.view === 'settings'}
                    onClick={() => props.selectSideView('settings')}
                />
            </Tooltip>
            <Tooltip
                content={<span>Evaluator</span>}
                hoverOpenDelay={500}
                intent={Intent.PRIMARY}
                position={Position.RIGHT}
            >
                <Button
                    icon={'console'}
                    minimal={true}
                    large={true}
                    active={props.view === 'evaluator'}
                    onClick={() => props.selectSideView('evaluator')}
                />
            </Tooltip>
        </div>
    );

};

export default connector(SterlingSidebar);