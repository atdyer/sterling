import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import QuickColorScheme from '../../drawer-components/QuickColorScheme';
import { setColorScheme, toggleCollapseScheme } from './nodeStylingSlice';

const mapState = (state: RootState) => ({
    collapse: state.graphSlice.nodeStylingSlice.collapseScheme
});

const mapDispatch = {
    setColorScheme,
    toggleCollapseScheme
};

const connector = connect(mapState, mapDispatch);

type QuickNodeStylingProps = ConnectedProps<typeof connector>;

const QuickNodeStyling: React.FunctionComponent<QuickNodeStylingProps> = props => {

    return (
        <SterlingDrawer.Section
            collapsed={props.collapse}
            onToggle={props.toggleCollapseScheme}
            title={'Quick Color Scheme'}>
            <QuickColorScheme onClick={props.setColorScheme}/>
        </SterlingDrawer.Section>
    )

};

export default connector(QuickNodeStyling);
