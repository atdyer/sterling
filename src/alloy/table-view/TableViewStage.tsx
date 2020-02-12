import { Card } from '@blueprintjs/core';
import { AlloyField, AlloySignature, AlloySkolem } from 'alloy-ts';
import React, { ReactNode } from 'react';
import {
    HorizontalAlignment,
    LayoutDirection,
    SigFieldSkolem
} from '../../sterling/SterlingTypes';
import FieldHTMLTable from './stage-components/FieldHTMLTable';
import SignatureHTMLTable from './stage-components/SignatureHTMLTable';
import SkolemHTMLTable from './stage-components/SkolemHTMLTable';
import { FieldTag, SignatureTag, SkolemTag } from './TableTags';
import { ITableViewState } from './TableView';

export interface ITableViewStageProps extends ITableViewState {
    itemsVisible: SigFieldSkolem[]
}

class TableViewStage extends React.Component<ITableViewStageProps> {

    render (): React.ReactNode {

        const tableAlign = this.props.tableAlignment;
        const tableLayout = this.props.layoutDirection;

        const alignClass =
            tableAlign === HorizontalAlignment.Left ? 'left' :
            tableAlign === HorizontalAlignment.Center ? 'center' :
            tableAlign === HorizontalAlignment.Right ? 'right' : '';

        const layoutClass =
            tableLayout === LayoutDirection.Row ? 'row' :
            tableLayout === LayoutDirection.Column ? 'column' : '';

        return <div className={`stage table-stage ${alignClass} ${layoutClass}`} id='stage'>
            { this._getElements() }
        </div>

    }

    private _getElements (): ReactNode[] {

        return this.props.itemsVisible.map((item: SigFieldSkolem) => {

            const itemType = item.expressionType();

            if (itemType === 'signature') {

                const props = {
                    highlightSkolems: this.props.highlightSkolems,
                    signature: item as AlloySignature,
                    skolemColors: this.props.skolemColors
                };

                return (
                    <Card
                        key={item.id()}
                        elevation={2}>
                        <SignatureTag
                            fill={true}
                            signature={item as AlloySignature}
                            nameFunction={this.props.nameFunction}/>
                        {SignatureHTMLTable(props)}
                    </Card>
                );

            } else if (itemType === 'field') {

                const props = {
                    field: (item as AlloyField),
                    highlightSkolems: this.props.highlightSkolems,
                    nameFunction: this.props.nameFunction,
                    skolemColors: this.props.skolemColors
                };

                return (
                    <Card
                        key={item.id()}
                        elevation={2}>
                        <FieldTag
                            fill={true}
                            field={item as AlloyField}
                            nameFunction={this.props.nameFunction}/>
                        {FieldHTMLTable(props)}
                    </Card>
                );

            } else if (itemType === 'skolem') {

                const props = {
                    color: 'red',
                    skolem: (item as AlloySkolem),
                    nameFunction: this.props.nameFunction
                };

                return (
                    <Card
                        key={item.id()}
                        elevation={2}>
                        <SkolemTag
                            fill={true}
                            skolem={item as AlloySkolem}
                            nameFunction={this.props.nameFunction}/>
                        {SkolemHTMLTable(props)}
                    </Card>
                )

            }

            return null;

        });

    }

}

export default TableViewStage;
