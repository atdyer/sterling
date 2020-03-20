import {
    Button,
    ButtonGroup,
    FormGroup,
    HTMLTable,
    Label
} from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../rootReducer';
import SterlingDrawer from '../../sterling/SterlingDrawer';
import {
    setStage,
    toggleCollapseLibraries,
    toggleCollapseSettings,
    toggleCollapseVariables
} from './scriptSlice';

const mapState = (state: RootState) => ({
    instance: state.sterlingSlice.instance,
    view: state.sterlingSlice.scriptView,
    ...state.scriptSlice
});

const mapDispatch = {
    setStage,
    toggleCollapseLibraries,
    toggleCollapseSettings,
    toggleCollapseVariables
};

const connector = connect(mapState, mapDispatch);

type ScriptDrawerProps = ConnectedProps<typeof connector>;

interface ILinkProps {
    href: string
}

const Link: React.FunctionComponent<ILinkProps> = props => {
    // eslint-disable-next-line react/jsx-no-target-blank
    return <a href={props.href} target={'_blank'} rel={'noreferrer noopener'}>{ props.children }</a>
};

class ScriptDrawer extends React.Component<ScriptDrawerProps> {

    render (): React.ReactNode {

        const props = this.props;

        return <>
            <SterlingDrawer.Section
                collapsed={props.collapseSettings}
                onToggle={props.toggleCollapseSettings}
                title={'Script Settings'}>
                <FormGroup inline={true} label={'Stage type'}>
                    <ButtonGroup>
                        <Button
                            active={props.stage === 'canvas'}
                            onClick={() => props.setStage('canvas')}
                            text={'Canvas'}/>
                        <Button
                            active={props.stage === 'svg'}
                            onClick={() => props.setStage('svg')}
                            text={'SVG'}/>
                    </ButtonGroup>
                </FormGroup>
            </SterlingDrawer.Section>
            <SterlingDrawer.Section
                collapsed={props.collapseLibraries}
                onToggle={props.toggleCollapseLibraries}
                title={'Libraries'}>
                <Label>The following libraries are available in the scripting environment:</Label>
                <HTMLTable className={'fill'} condensed={true}>
                    <thead>
                    <tr>
                        <th scope={'col'}>Name</th>
                        <th scope={'col'}>Library</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>d3</td>
                        <td><Link href={'https://d3js.org/'}>D3</Link></td>
                    </tr>
                    </tbody>
                </HTMLTable>
            </SterlingDrawer.Section>
            <SterlingDrawer.Section
                collapsed={props.collapseVariables}
                onToggle={props.toggleCollapseVariables}
                title={'Variables'}>
                <Label>The following variables are available in the scripting environment:</Label>
                <HTMLTable className={'fill'} condensed={true}>
                    <thead>
                    <tr>
                        <th scope={'col'}>Name</th>
                        <th scope={'col'}>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this._instanceRow() }
                    { this._stageRow() }
                    <tr>
                        <td>width</td>
                        <td>{props.width}</td>
                    </tr>
                    <tr>
                        <td>height</td>
                        <td>{props.height}</td>
                    </tr>
                    </tbody>
                </HTMLTable>
            </SterlingDrawer.Section>
        </>
    }

    private _canvasRow (): React.ReactNode {

        return <tr>
            <td>canvas</td>
            <td>
                <Link href={'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API'}>
                    {"<canvas>"}
                </Link>
            </td>
        </tr>

    }

    private _instanceRow (): React.ReactNode {

        return <tr>
            <td>instance</td>
            <td>
                {
                    this.props.instance
                        ? <Link href={'https://alloy-js.github.io/alloy-ts/classes/alloyinstance.html'}>AlloyInstance</Link>
                        : "null"
                }
            </td>
        </tr>;

    }

    private _stageRow (): React.ReactNode {

        if (this.props.stage === 'canvas') return this._canvasRow();
        if (this.props.stage === 'svg') return this._svgRow();
        return null;

    }

    private _svgRow (): React.ReactNode {

        return <tr>
            <td>svg</td>
            <td>
                <Link href={'https://developer.mozilla.org/en-US/docs/Web/SVG'}>
                    {"<svg>"}
                </Link>
            </td>
        </tr>

    }

}

export default connector(ScriptDrawer);
