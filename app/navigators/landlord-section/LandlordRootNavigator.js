import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import * as Colors from '../../components/helpers/ColorPallette';
import LandlordTabBar from './LandlordTabBarNavigator';
import LandlordPropertiesNavigator from '../../components/templates/landlord-section/properties-tab/Navigator';
import LandlordViewingsNavigator from '../../components/templates/landlord-section/viewings-tab/Navigator';
import {  createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
  TabBar: { 
    screen: LandlordTabBar
  },
  PropertyStack: {
    screen: LandlordPropertiesNavigator
  },
  ViewingsStack: {
    screen: LandlordViewingsNavigator
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

export const LandlordRootNavigator = StackNavigator(routeConfiguration, configuration);


class LandlordRootNav extends React.Component {

  render(){
    const { dispatch, navigationState } = this.props;
    const addListener = createReduxBoundAddListener("root");

    try{
      return (
        <LandlordRootNavigator 
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
    navigationState: state.landlordRootNav,
  }
}


export default connect(mapStateToProps)(LandlordRootNav)
