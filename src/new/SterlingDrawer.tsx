import React from 'react';

class SterlingDrawer extends React.Component {

    render (): React.ReactNode {

        return (
            <div className={'drawer'}>
                { this.props.children }
            </div>
        );

    }

}

export default SterlingDrawer;
