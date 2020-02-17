import { FormGroup, HTMLSelect, NonIdealState, Tree } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import SterlingDrawer from '../../sterling/SterlingDrawer';
import {
    collapseTreeNode,
    expandTreeNode,
    selectItem,
    setShape,
    toggleCollapseLayout,
    toggleCollapseTheme
} from './graphSlice';

// Map redux state to graph settings props
const mapState = (state: RootState) => ({
    settings: state.graphSlice
});

// Actions
const mapDispatch = {
    collapseTreeNode,
    expandTreeNode,
    selectItem,
    setShape,
    toggleCollapseLayout,
    toggleCollapseTheme
};

// Create connector
const connector = connect(mapState, mapDispatch);

// Create props for things from redux
type GraphStageProps = ConnectedProps<typeof connector>;

// The graph settings component
const GraphSettings: React.FunctionComponent<GraphStageProps> = props => {

    const settings = props.settings;
    const selectedItem = settings.selectedItem;
    const selectedStyle = selectedItem
        ? settings.sigStyles[selectedItem.id]
        : null;

    return (
        <>
            <SterlingDrawer.Section
                collapsed={settings.collapseLayout}
                onToggle={props.toggleCollapseLayout}
                title={'Layout'}>
                HI.
            </SterlingDrawer.Section>
            <SterlingDrawer.Section
                collapsed={settings.collapseTheme}
                onToggle={props.toggleCollapseTheme}
                title={'Theme'}>
                <Tree
                    contents={[settings.sigTree || {id: 0, label: 'nope'}]}
                    onNodeClick={props.selectItem}
                    onNodeCollapse={props.collapseTreeNode}
                    onNodeExpand={props.expandTreeNode}
                />
                {
                    selectedItem
                        ? (
                            <>
                                <ShapeSelector
                                    selected={selectedStyle ? selectedStyle.type : null}
                                    onSetShape={props.setShape}
                                />
                            </>
                        )
                        : (
                            <NonIdealState
                            title={'Signature Theme'}
                            description={'Select a signature from the tree'}
                            icon={'style'}/>
                        )
                }

            </SterlingDrawer.Section>
        </>
    )
};

interface IShapeSelector {
    selected: 'circle' | 'rectangle' | null,
    onSetShape: (shape: 'circle' | 'rectangle' | null) => void
}

const ShapeSelector: React.FunctionComponent<IShapeSelector> = props => {

    const value = props.selected || 'inheret';

    const options = [
        { value: 'inheret', label: 'Inheret' },
        { value: 'circle', label: 'Circle' },
        { value: 'rectangle', label: 'Rectangle' }
    ];

    return (
        <FormGroup inline={true} label={'Shape'}>
            <HTMLSelect
                options={options}
                value={value}
                onChange={event => {
                    let value = event.target.value;
                    props.onSetShape(value === 'inheret'
                        ? null : value === 'circle'
                        ? 'circle' : value === 'rectangle'
                        ? 'rectangle' : null);
                }}
            />
        </FormGroup>
    )
};

export default connector(GraphSettings);
