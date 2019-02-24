import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import * as Colors from '../../components/helpers/ColorPallette';
import PropertiesScreen from '../../components/templates/guest-section/properties-tab/PropertiesScreen';
import FavouritesScreen from '../../components/templates/guest-section/favourites-tab/FavouritesScreen';
import ViewingsScreen from '../../components/templates/guest-section/viewings-tab/ViewingsScreen';
import OptionsTab from '../../components/templates/shared/options-tab/Navigator';
import ChatsContainer from '../../components/templates/guest-section/chats-tab/ChatsContainer';
import {  createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
  PropertiesTab: { 
    screen: PropertiesScreen
  },
  FavouritesTab: {
    screen: FavouritesScreen
  },
  ChatsTab: {
   screen: ChatsContainer
  },
  ViewingsTab: {
    screen: ViewingsScreen
  },
  Options: {
    screen: OptionsTab
  }
}

const tabBarConfiguration = {
  tabBarPosition: 'bottom',
  headerMode: 'screen',
  backBehavior: 'none',
  tabBarOptions: {
    activeTintColor: Colors.AQUA_GREEN,
    inactiveTintColor: Colors.WHITE_SMOKE,
    showLabel: false,
		style:{
      backgroundColor: Colors.DARK_BLUE,
      height: 60
    } 
  }
}

export const GuestTabBarNavigator = TabNavigator(routeConfiguration,tabBarConfiguration);


class GuestTabBar extends React.Component {

  render(){
    const { dispatch, navigationState } = this.props;
    const addListener = createReduxBoundAddListener("root");

    try{
      return (
        <GuestTabBarNavigator 
          navigation={
            addNavigationHelpers({
              dispatch: dispatch,
              state: navigationState,
              addListener
            })
          }
        />
      )
    }
    catch(e){
      return null;
    }
    
  }
}


const mapStateToProps = (state) => {
 return {
    navigationState: state.guestTabBar,
    network: state.network
  }
}


export default connect(mapStateToProps)(GuestTabBar)
