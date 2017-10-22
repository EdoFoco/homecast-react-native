import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import * as Colors from '../../components/helpers/ColorPallette';
import FavouritesNavigator  from '../../components/templates/guest-section/favourites-tab/Navigator';
import PropertiesNavigator  from '../../components/templates/guest-section/properties-tab/Navigator';
import GuestViewingsTab from '../../components/templates/guest-section/viewings-tab/Navigator';
import OptionsTab from '../../components/templates/shared/options-tab/Navigator';

const routeConfiguration = {
  Properties: { 
    screen: PropertiesNavigator
  },
  FavouritesTab: {
    screen: FavouritesNavigator
  },
  ViewingsTab: {
    screen: GuestViewingsTab
  },
  Options: {
    screen: OptionsTab
  }
}

const tabBarConfiguration = {
  headerMode: 'screen',
  backBehavior: 'none',
  tabBarOptions: {
    activeTintColor: Colors.PINK,
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
  }
}


export default connect(mapStateToProps)(GuestTabBar)
