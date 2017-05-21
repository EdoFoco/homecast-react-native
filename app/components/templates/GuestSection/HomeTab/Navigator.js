import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { GuestHomeNavigator } from '../../../../navigators/GuestSection/HomeNavigator';
import { connect } from 'react-redux';

class GuestHomeNav extends React.Component {
    render(){
        const { navigationState, dispatch } = this.props;
        
        console.log(this.props);
        return (
            <GuestHomeNavigator  
                navigation={
                addNavigationHelpers({
                    dispatch: dispatch,
                    state: navigationState
                })
            } />
        );  
      }
}

const mapStateToProps = (state) => {
    return {
        navigationState: state.guestHomeNav
    }
}

export default connect(mapStateToProps)(GuestHomeNav)