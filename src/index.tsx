import React from 'react';
import ReactDOM from 'react-dom';
import { AlloyConnection } from './alloy/AlloyConnection';
import Sterling from './new/Sterling';
import * as serviceWorker from './serviceWorker';
import './styles/new/index.scss';

const alloy = new AlloyConnection();

// const graph: ISterlingUIView = {
//     name: 'Graph',
//     icon: 'graph',
//     view: GraphView
// };
//
// const table: ISterlingUIView = {
//     name: 'Table',
//     icon: 'th',
//     view: TableView
// };
//
// const ui = (
//     <Sterling
//         connection={alloy}
//         message={'Use Alloy to generate an instance.'}
//         navbar={AlloyNavbar}
//         views={[table, graph]}/>
// );

const ui = <Sterling connection={alloy}/>;

ReactDOM.render(ui, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
