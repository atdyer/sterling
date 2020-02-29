import {
    Button,
    ControlGroup,
    HTMLSelect,
    Popover,
    Position,
    Text
} from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../rootReducer';
import SterlingDrawer from '../../../../sterling/SterlingDrawer';
import { POPPER_MODIFIERS } from '../../util';
import {
    addProjection,
    nextAtom,
    previousAtom,
    removeProjection,
    setProjection,
    toggleCollapseProjections
} from '../data/dataSlice';


const mapState = (state: RootState) => ({
    ...state.graphSlice.dataSlice
});

const mapDispatch = {
    addProjection,
    nextAtom,
    previousAtom,
    removeProjection,
    setProjection,
    toggleCollapseProjections
};

const connector = connect(mapState, mapDispatch);

type ProjectionsProps = ConnectedProps<typeof connector>;

const Projections: React.FunctionComponent<ProjectionsProps> = props => {

    const projections = props.projections.toArray();

    return (
        <SterlingDrawer.Section
            collapsed={props.collapseProjections}
            onToggle={props.toggleCollapseProjections}
            title={'Projections'}>
            <div className={'projections'}>
                {
                    projections.map(projection => {
                        const sig = projection[0];
                        const atom = projection[1];
                        const atoms = props.atoms.get(sig) || [];
                        return <React.Fragment key={sig}>
                            <Text ellipsize={true}>{ sig }</Text>
                            <HTMLSelect
                                minimal={true}
                                onChange={event => {
                                    props.setProjection({
                                        sig: sig,
                                        atom: event.target.value
                                    })
                                }}
                                options={atoms}
                                value={atom}/>
                            <div className={'buttons'}>
                                <Button
                                    icon={'chevron-left'}
                                    minimal={true}
                                    onClick={() => props.previousAtom(sig)}/>
                                <Button
                                    icon={'cross'}
                                    minimal={true}
                                    onClick={() => props.removeProjection(sig)}/>
                                <Button
                                    icon={'chevron-right'}
                                    minimal={true}
                                    onClick={() => props.nextAtom(sig)}/>
                            </div>
                        </React.Fragment>
                    })
                }
            </div>
            {
                props.unprojected.size > 0 && (
                    <Popover
                        className={'centered'}
                        hasBackdrop={true}
                        modifiers={POPPER_MODIFIERS}
                        position={Position.BOTTOM}
                        usePortal={true}
                        wrapperTagName={'div'}>
                        <Button
                            icon={'add'}
                            minimal={true}
                            text={'Add Projection'}/>
                        <ControlGroup vertical={true}>
                            {
                                props.unprojected.map(sig => (
                                    <Button
                                        key={sig}
                                        minimal={true}
                                        onClick={() => props.addProjection(sig)}
                                        text={sig}/>
                                ))
                            }
                        </ControlGroup>
                    </Popover>
                )
            }
        </SterlingDrawer.Section>
    );

};

export default connector(Projections);
