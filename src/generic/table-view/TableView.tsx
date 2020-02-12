import React from 'react';
import { ISterlingViewProps } from '../../sterling/SterlingTypes';

interface ITableViewProps extends ISterlingViewProps {

}

class TableView extends React.Component<ITableViewProps> {

    render (): React.ReactNode {
        if (!this.props.visible) return null;
        return <div></div>;
    }

}

export default TableView;
