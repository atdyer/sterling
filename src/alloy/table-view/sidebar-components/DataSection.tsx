import * as React from 'react';
import SterlingSidebar from '../../../sterling/SterlingSidebar';
import { Alignment, FormGroup, Switch } from '@blueprintjs/core';
import { ITableViewState } from '../TableView';
import { TablesType } from '../../../sterling/SterlingTypes';

export interface IDataSectionProps extends ITableViewState {
    onToggleBuiltin: () => void,
    onToggleCollapse: () => void,
    onToggleEmpty: () => void,
    onToggleHighlightSkolems: () => void,
    onToggleRemoveThis: () => void
}

class DataSection extends React.Component<IDataSectionProps> {

    render (): React.ReactNode {

        const props = this.props;

        return (
            <SterlingSidebar.Section
                collapsed={props.collapseData}
                onToggleCollapse={props.onToggleCollapse}
                title='Data Options'>

                <FormGroup>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={props.removeBuiltin}
                        disabled={props.tables === TablesType.Select}
                        label='Hide Built-in Signatures'
                        onChange={props.onToggleBuiltin}/>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={props.removeEmpty}
                        disabled={props.tables === TablesType.Select}
                        label='Hide Empty Tables'
                        onChange={props.onToggleEmpty}/>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={props.removeThis}
                        label='Remove "this" from Signature names'
                        onChange={props.onToggleRemoveThis}/>

                    <Switch
                        alignIndicator={Alignment.LEFT}
                        checked={props.highlightSkolems}
                        label='Display Skolems as highlighted rows'
                        onChange={props.onToggleHighlightSkolems}/>

                </FormGroup>

            </SterlingSidebar.Section>
        )

    }

}

export default DataSection;
