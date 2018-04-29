import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import * as Colors from '../../components/helpers/ColorPallette';
import FavouritesNavigator  from '../../components/templates/guest-section/favourites-tab/Navigator';
import PropertiesNavigator  from '../../components/templates/guest-section/properties-tab/Navigator';
import GuestViewingsTab from '../../components/templates/guest-section/viewings-tab/Navigator';
import OptionsTab from '../../components/templates/shared/options-tab/Navigator';
import GuestChatsTab from '../../components/templates/guest-section/chats-tab/Navigator';
import NetworkErrorMessage from '../../components/templates/shared/NetworkErrorMessage';
import {  createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
  Properties: { 
    screen: PropertiesNavigator
  },
  FavouritesTab: {
    screen: FavouritesNavigator
  },
  ChatsTab: {
    screen: GuestChatsTab
  },
  ViewingsTab: {
    screen: GuestViewingsTab
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
    showLabel: false,
		style:{
      backgroundColor: 'white',
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
