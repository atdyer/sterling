import { createStore } from '@reduxjs/toolkit';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AlloyConnection } from './connections/AlloyConnection';
import { ForgeConnection } from './connections/ForgeConnection';
import NoConnection from './connections/NoConnection';
import { sterlingApp } from './rootReducer';
import Sterling from './sterling/Sterling';
import * as serviceWorker from './serviceWorker';
import './styles/index.scss';

const target = process.env.REACT_APP_BUILD_TARGET;
const connection = target === 'alloy' ? new AlloyConnection()
    : target === 'forge' ? new ForgeConnection()
    : target === 'static' ? new NoConnection()
    : new AlloyConnection();
const store = createStore(sterlingApp);

ReactDOM.render(
    <Provider store={store}>
        <Sterling connection={connection}/>
    </Provider>,
    document.getElementById('root'))
;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
