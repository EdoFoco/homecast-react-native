import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { LandlordHomeNavigator } from '../../../../navigators/landlord-section/HomeNavigator';
import { connect } from 'react-redux';

class LandlordHomeTab extends React.Component {

    static navigationOptions = {
            tabBarLabel: 'Home'
    }

    render(){
        
        const { navigationState, dispatch } = this.props;
        
        return (
            <LandlordHomeNavigator  
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
        navigationState: state.landlordHomeNav
    }
}

export default connect(mapStateToProps)(LandlordHomeTab)