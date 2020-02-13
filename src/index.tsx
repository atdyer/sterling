import React from 'react';
import ReactDOM from 'react-dom';
import { AlloyConnection } from './alloy/AlloyConnection';
import AlloyNavbar from './alloy/AlloyNavbar';
import GraphView from './alloy/graph-view/GraphView';
import TableView from './alloy/table-view/TableView';
import * as serviceWorker from './serviceWorker';
import Sterling from './sterling/Sterling';
import { ISterlingUIView } from './sterling/SterlingTypes';
import './styles/index.scss';

const alloy = new AlloyConnection();

const graph: ISterlingUIView = {
    name: 'Graph',
    icon: 'graph',
    view: GraphView
};

const table: ISterlingUIView = {
    name: 'Table',
    icon: 'th',
    view: TableView
};

const ui = (
    <Sterling
        connection={alloy}
        message={'Use Alloy to generate an instance.'}
        navbar={AlloyNavbar}
        views={[table, graph]}/>
);

ReactDOM.render(ui, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
