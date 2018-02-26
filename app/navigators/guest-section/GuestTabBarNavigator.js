import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import * as Colors from '../../components/helpers/ColorPallette';
import FavouritesNavigator  from '../../components/templates/guest-section/favourites-tab/Navigator';
import PropertiesNavigator  from '../../components/templates/guest-section/properties-tab/Navigator';
import GuestViewingsTab from '../../components/templates/guest-section/viewings-tab/Navigator';
import OptionsTab from '../../components/templates/shared/options-tab/Navigator';
import NetworkErrorMessage from '../../components/templates/shared/NetworkErrorMessage';

const routeConfiguration = {
  ViewingsTab: {
    screen: GuestViewingsTab
  },
  Properties: { 
    screen: PropertiesNavigator
  },
  FavouritesTab: {
    screen: FavouritesNavigator
  },
  Options: {
    screen: OptionsTab
  }
}

const tabBarConfiguration = {
  initialRoute: 'ViewingsTab',
  headerMode: 'screen',
  backBehavior: 'none',
  tabBarOptions: {
    activeTintColor: Colors.RED,
		style:{
      backgroundColor: 'white',
    } 
  }
}

export const GuestTabBarNavigator = TabNavigator(routeConfiguration,tabBarConfiguration);

class GuestTabBar extends React.Component {

  render(){
    const { dispatch, navigationState } = this.props
    return (
      <GuestTabBarNavigator 
        navigation={
          addNavigationHelpers({
            dispatch: dispatch,
            state: navigationState
          })
        }
      />
    )
  }
}


const mapStateToProps = (state) => {
 return {
    navigationState: state.guestTabBar,
    network: state.network
  }
}


export default connect(mapStateToProps)(GuestTabBar)
