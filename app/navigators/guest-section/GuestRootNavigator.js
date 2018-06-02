import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import * as Colors from '../../components/helpers/ColorPallette';
import GuestTabBar from './GuestTabBarNavigator';
import PropertiesNavigator  from '../../components/templates/guest-section/properties-tab/Navigator';
import NetworkErrorMessage from '../../components/templates/shared/NetworkErrorMessage';
import {  createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
  TabBar: { 
    screen: GuestTabBar
  },
  PropertyStack: {
    screen: PropertiesNavigator
  }
}

const configuration = {
  initialRoute: 'TabBar',
  headerMode: 'none',
  backBehavior: 'none',
  mode: 'modal',
  tabBarOptions: {
    activeTintColor: Colors.RED,
    showLabel: false,
		style:{
      backgroundColor: 'white',
      height: 60
    } 
  }
}

export const GuestRootNavigator = StackNavigator(routeConfiguration, configuration);


class GuestRootNav extends React.Component {

  render(){
    const { dispatch, navigationState } = this.props;
    const addListener = createReduxBoundAddListener("root");

    try{
      return (
        <GuestRootNavigator 
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
    navigationState: state.guestRootNav,
    network: state.network
  }
}


export default connect(mapStateToProps)(GuestRootNav)
