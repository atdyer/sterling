import {
    Button,
    Menu,
    MenuDivider,
    MenuItem,
    Navbar,
    NavbarDivider,
    Popover,
    Tag
} from '@blueprintjs/core';
import { AlloyInstance } from 'alloy-ts';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import { setInstance } from '../../sterling/sterlingSlice';
import ViewGroup from './components/ViewGroup';

const mapState = (state: RootState) => ({
    instance: state.sterlingSlice.instance
});

const mapDispatch = {
    setInstance
};

const connector = connect(
    mapState,
    mapDispatch
);

type StaticNavbarProps = ConnectedProps<typeof connector>;

const StaticNavbar: React.FunctionComponent<StaticNavbarProps> = props => {

    const command = props.instance ? props.instance.command() : '';
    const fileref = React.createRef<HTMLInputElement>();

    const setInstance = (text: string | ArrayBuffer | null) => {
        if (typeof text === 'string' && text.length) {
            try {
                const instance = new AlloyInstance(text);
                props.setInstance(instance);
            } catch (e) {
                props.setInstance(null);
            }
        } else {
            props.setInstance(null);
        }
    };

    const onFileChange = () => {
        if (fileref.current) {
            const files = fileref.current.files;
            if (files && files.length) {
                const file = files[0];
                const reader = new FileReader();
                reader.addEventListener('load', event => {
                    setInstance(event.target ? event.target.result : null);
                });
                reader.readAsText(file);
            }
        }
    };

    const fetchExample = (path: string) => {
        fetch(path)
            .then(response => response.text())
            .then(setInstance)
            .catch(() => setInstance(null));
    };

    return (
        <Navbar fixedToTop className={'nav bp3-dark'}>
            <ViewGroup/>
            <Navbar.Group className={'collapsing'}>
                {
                    command.length > 0 &&
                    <Tag minimal={true}>
                        { command }
                    </Tag>
                }
                <NavbarDivider/>
                <input
                    type={'file'}
                    style={{ display: 'none' }}
                    onChange={onFileChange}
                    ref={fileref}/>
                <Popover>
                    <Button
                        rightIcon={'caret-down'}
                        intent={'success'}
                        large={true}
                        text={'Open'}/>
                    <Menu>
                        <MenuItem
                            text={'Open XML...'}
                            onClick={() => {
                                if (fileref.current) {
                                    fileref.current.click();
                                }
                            }}/>
                        <MenuDivider title={'Examples'}/>
                        <MenuItem
                            text={'Finite Element Mesh'}
                            onClick={() => fetchExample('examples/mesh.xml')}/>
                        <MenuItem
                            text={'Geneaology'}
                            onClick={() => fetchExample('examples/genealogy.xml')}/>
                        <MenuItem
                            text={'Mathematical Matrix'}
                            onClick={() => fetchExample('examples/matrix.xml')}/>
                        <MenuItem
                            text={'River Crossing Puzzle'}
                            onClick={() => fetchExample('examples/river-crossing.xml')}/>
                        <MenuItem
                            text={'Wetting and Drying'}
                            onClick={() => fetchExample('examples/wetdry.xml')}/>
                    </Menu>
                </Popover>
            </Navbar.Group>
        </Navbar>
    )
};

export default connector(StaticNavbar);
