import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { GuestHomeNavigator } from '../../../../navigators/guest-section/HomeNavigator';
import { connect } from 'react-redux';

class GuestHomeTab extends React.Component {

    static navigationOptions = {
            tabBarLabel: 'Home'
    }

    render(){
        
        const { navigationState, dispatch } = this.props;
        
        return (
            <GuestHomeNavigator  
                navigation={
                addNavigationHelpers({
                    dispatch: dispatch,
                    state: navigationState
                })
            }  />
        );  
      }
}

const mapStateToProps = (state) => {
    return {
        navigationState: state.guestHomeNav
    }
}

export default connect(mapStateToProps)(GuestHomeTab)