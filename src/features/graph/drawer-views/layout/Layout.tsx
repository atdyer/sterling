import { DagreLayout } from '@atdyer/graph-js';
import { Button, FormGroup, HTMLSelect, NumericInput } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import {
    Alignment, Direction, Ranker,
    setAlign,
    setNodeSep,
    setRankDir,
    setRanker,
    setRankSep,
    toggleCollapseLayout
} from './layoutSlice';

const ALIGN_OPTIONS = [
    { value: 'undefined', label: '---' },
    { value: 'UL', label: 'Bottom Left'},
    { value: 'UR', label: 'Bottom Right'},
    { value: 'DL', label: 'Top Left' },
    { value: 'DR', label: 'Top Right' }
];

const DIRECTION_OPTIONS = [
    { value: 'TB', label: 'Bottom to Top' },
    { value: 'BT', label: 'Top to Bottom' },
    { value: 'LR', label: 'Left to Right' },
    { value: 'RL', label: 'Right to Left' }
];

const RANKER_OPTIONS = [
    { value: 'network-simplex', label: 'Network Simplex' },
    { value: 'tight-tree', label: 'Tight Tree' },
    { value: 'longest-path', label: 'Longest Path' }
];

const mapState = (state: RootState) => ({
    collapseLayout: state.graphSlice.layoutSlice.collapseLayout,
    graph: state.graphSlice.graphSlice.graph,
    options: state.graphSlice.layoutSlice
});

const mapDispatch = {
    setAlign,
    setNodeSep,
    setRankDir,
    setRanker,
    setRankSep,
    toggleCollapseLayout
};

const connector = connect(mapState, mapDispatch);

type LayoutProps = ConnectedProps<typeof connector>;

const Layout: React.FunctionComponent<LayoutProps> = props => {

    const options = Object.assign({}, props.options);

    return (
        <SterlingDrawer.Section
            collapsed={props.collapseLayout}
            onToggle={props.toggleCollapseLayout}
            title={'Layout'}>
            <FormGroup inline={true} label={'Align'}>
                <HTMLSelect
                    minimal={true}
                    options={ALIGN_OPTIONS}
                    value={options.align === undefined ? 'undefined' : options.align}
                    onChange={event => {
                        const value = event.target.value === 'undefined' ? undefined : event.target.value;
                        props.setAlign(value as Alignment)
                    }}/>
            </FormGroup>
            <FormGroup inline={true} label={'Node Separation'}>
                <NumericInput
                    allowNumericCharactersOnly={true}
                    fill={false}
                    value={options.nodesep}
                    onValueChange={value => props.setNodeSep(value)}/>
            </FormGroup>
            <FormGroup inline={true} label={'Ranking Method'}>
                <HTMLSelect
                    minimal={true}
                    options={RANKER_OPTIONS}
                    value={options.ranker}
                    onChange={event =>
                        props.setRanker(event.target.value as Ranker)
                    }/>
            </FormGroup>
            <FormGroup inline={true} label={'Rank Direction'}>
                <HTMLSelect
                    minimal={true}
                    options={DIRECTION_OPTIONS}
                    value={options.rankdir}
                    onChange={event =>
                        props.setRankDir(event.target.value as Direction)
                    }/>
            </FormGroup>
            <FormGroup inline={true} label={'Rank Separation'}>
                <NumericInput
                    allowNumericCharactersOnly={true}
                    fill={false}
                    value={options.ranksep}
                    onValueChange={value => props.setRankSep(value)}/>
            </FormGroup>
            <Button
                minimal={true}
                text={'Apply Layout'}
                onClick={() => {
                    if (props.graph) {
                        const dagre = new DagreLayout();
                        dagre.apply(props.graph, options);
                        props.graph.update();
                    }
                }}/>
        </SterlingDrawer.Section>
    );

};

export default connector(Layout);
