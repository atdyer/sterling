import { Button, ButtonGroup, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import { backgroundGradient, COLOR_SCHEMES } from '../../util';
import { setColorScheme, toggleCollapseScheme } from './edgeStylingSlice';

const mapState = (state: RootState) => ({
    collapse: state.graphSlice.edgeStylingSlice.collapseScheme,
    labelStyles: state.graphSlice.edgeStylingSlice.labelStyles,
    linkStyles: state.graphSlice.edgeStylingSlice.linkStyles
});

const mapDispatch = {
    setColorScheme,
    toggleCollapseScheme
};

const connector = connect(mapState, mapDispatch);

type QuickEdgeStylingProps = ConnectedProps<typeof connector>;

const QuickEdgeStyling: React.FunctionComponent<QuickEdgeStylingProps> = props => {

    return (
        <SterlingDrawer.Section
            collapsed={props.collapse}
            onToggle={props.toggleCollapseScheme}
            title={'Quick Color Scheme'}>
            <ButtonGroup minimal={true} style={{
                flexWrap: 'wrap',
                maxHeight: '15px',
                overflow: 'hidden'
            }}>
                {
                    COLOR_SCHEMES.map(([name, scheme]) => (
                        <Tooltip content={name} key={name}>
                            <Button minimal={true} style={{
                                background: backgroundGradient(scheme.slice(0, 6)),
                                margin: '0 5px',
                                minWidth: '40px',
                                minHeight: '15px'
                            }} onClick={() => props.setColorScheme(scheme)}/>
                        </Tooltip>
                    ))
                }
            </ButtonGroup>
        </SterlingDrawer.Section>
    );
};

export default connector(QuickEdgeStyling);
