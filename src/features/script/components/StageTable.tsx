import { HTMLTable } from '@blueprintjs/core';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../rootReducer';
import Link from './Link';

const mapState = (state: RootState) => ({
    stage: state.scriptSlice.stage,
    width: state.scriptSlice.width,
    height: state.scriptSlice.height
});

const connector = connect(mapState);

type StageTableProps = ConnectedProps<typeof connector>;

class StageTable extends React.Component<StageTableProps> {

    render (): React.ReactNode {

        return <HTMLTable className={'fill'} condensed={true} striped={true}>
            <thead>
            <tr>
                <th scope={'col'}>Variable</th>
                <th scope={'col'}>Value</th>
            </tr>
            </thead>
            <tbody>
            { this._stageRow() }
            <tr>
                <td>width</td>
                <td>{ this.props.width }</td>
            </tr>
            <tr>
                <td>height</td>
                <td>{ this.props.height }</td>
            </tr>
            </tbody>
        </HTMLTable>

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

    private _divRow (): React.ReactNode {

        return <tr>
            <td>div</td>
            <td>
                <Link href={'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div'}>
                    {"<div>"}
                </Link>
            </td>
        </tr>

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

    private _stageRow (): React.ReactNode {

        if (this.props.stage === 'canvas') return this._canvasRow();
        if (this.props.stage === 'div') return this._divRow();
        if (this.props.stage === 'svg') return this._svgRow();
        return null;

    }

}

export default connector(StageTable);
