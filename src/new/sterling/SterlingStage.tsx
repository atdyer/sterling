import React from 'react';

class SterlingStage extends React.Component {

    render (): React.ReactNode {

        return (
            <div className={'stage'}>
                { this.props.children }
            </div>
        );

    }

}

export default SterlingStage;
