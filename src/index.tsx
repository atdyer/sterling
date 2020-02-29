import { createStore } from '@reduxjs/toolkit';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AlloyConnection } from './alloy/AlloyConnection';
import { sterlingApp } from './rootReducer';
import Sterling from './sterling/Sterling';
import * as serviceWorker from './serviceWorker';
import './styles/index.scss';

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

const store = createStore(sterlingApp);

// Can't use this because alloy instance objects aren't serializable
// const store = configureStore({
//     reducer: sterlingApp
// });

ReactDOM.render(
    <Provider store={store}>
        <Sterling connection={alloy}/>
    </Provider>,
    document.getElementById('root'))
;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
