import { Button, Text } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../rootReducer';

import {
    nextAtom,
    previousAtom
} from '../scriptSlice';

const mapState = (state: RootState) => ({
    projections: state.scriptSlice.projections
});

const mapDispatch = {
    nextAtom,
    previousAtom
};

const connector = connect(mapState, mapDispatch);

type ScriptOverlayProps = ConnectedProps<typeof connector>;

const ScriptOverlay: React.FunctionComponent<ScriptOverlayProps> = props => {
    return props.projections.size
        ? <div className={'overlay'}>
            {
                props.projections.toArray().map(([sig, atom]) => (
                    <React.Fragment key={sig}>
                        <Text ellipsize={true}>{ atom }</Text>
                        <div className={'buttons'}>
                            <Button
                                icon={'chevron-left'}
                                minimal={true}
                                onClick={() => props.previousAtom(sig)}/>
                            <Button
                                icon={'chevron-right'}
                                minimal={true}
                                onClick={() => props.nextAtom(sig)}/>
                        </div>
                    </React.Fragment>
                ))
            }
          </div>
        : null;
};

export default connector(ScriptOverlay);
