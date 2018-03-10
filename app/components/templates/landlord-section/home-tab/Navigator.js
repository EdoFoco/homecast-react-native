import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { LandlordHomeNavigator } from '../../../../navigators/landlord-section/HomeNavigator';
import { connect } from 'react-redux';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

class LandlordHomeTab extends React.Component {

    static navigationOptions = {
            tabBarLabel: 'Home'
    }

    render(){
        
        const { navigationState, dispatch } = this.props;
        const addListener = createReduxBoundAddListener("root");

        return (
            <LandlordHomeNavigator  
                navigation={
                addNavigationHelpers({
                    dispatch: dispatch,
                    state: navigationState,
                    addListener
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