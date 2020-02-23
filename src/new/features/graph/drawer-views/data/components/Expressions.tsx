import React from 'react';
import SterlingDrawer from '../../../../../sterling/SterlingDrawer';

const Expressions: React.FunctionComponent = props => {

    return (
        <SterlingDrawer.Section
            collapsed={false}
            onToggle={() => {}}
            title={'Evaluator Expressions'}/>
    );

};

export default Expressions;
