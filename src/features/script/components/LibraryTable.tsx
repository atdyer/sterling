import { Button, HTMLTable, Icon, InputGroup } from '@blueprintjs/core';
import React, { KeyboardEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../rootReducer';
import { packageName } from '../ScriptRunner';
import {
    addLibrary,
    removeLibrary
} from '../scriptSlice';
import Link from './Link';

const mapState = (state: RootState) => ({
    libraries: state.scriptSlice.libraries
});

const mapDispatch = {
    addLibrary,
    removeLibrary
};

const connector = connect(mapState, mapDispatch);

type LibraryTableProps = ConnectedProps<typeof connector>;

interface ILibraryTableState {
    input: string
}

class LibraryTable extends React.Component<LibraryTableProps, ILibraryTableState> {

    constructor (props: LibraryTableProps) {

        super(props);

        this.state = {
            input: ''
        };

    }

    render (): React.ReactNode {

        return <HTMLTable className={'fill'} condensed={true} striped={true}>
            <thead>
            <tr>
                <th scope={'col'}>Variable</th>
                <th scope={'col'}>Library</th>
            </tr>
            </thead>
            <tbody>
            {
                this.props.libraries.toList().map(library => (
                    <tr key={library}>
                        <td>{packageName(library)}</td>
                        <td>
                            <Link href={`https://www.jsdelivr.com/package/npm/${packageName(library)}`}>{library}</Link>
                            <Button
                                style={{ marginLeft: '5px' }}
                                icon={<Icon icon={'cross'} iconSize={12}/>}
                                minimal={true}
                                small={true}
                                onClick={() => {
                                    this.props.removeLibrary(library);
                                }}/>
                        </td>
                    </tr>
                ))
            }
            <tr>
                <td colSpan={3}>
                    <InputGroup
                        fill={true}
                        placeholder={'Add library'}
                        onChange={this._onChange}
                        onKeyDown={this._onType}
                        value={this.state.input}/>
                </td>
            </tr>
            </tbody>
        </HTMLTable>

    }

    private _onChange = (event: any): void => {
        this.setState({
            input: event.target.value
        });
    };

    private _onType = (event: KeyboardEvent): void => {
        if (event.key === 'Enter' && this.state.input.length) {
            this.props.addLibrary(this.state.input);
            this.setState({
                input: ''
            });
        }
    }

}

export default connector(LibraryTable);
