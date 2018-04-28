import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import PropertiesNavigator  from '../../components/templates/landlord-section/properties-tab/Navigator';
import OptionsTab from '../../components/templates/shared/options-tab/Navigator';
import * as Colors from '../../components/helpers/ColorPallette';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

const routeConfiguration = {
  Properties: { 
    screen: PropertiesNavigator
  },
  Options: {
    screen: OptionsTab
  }
}

const tabBarConfiguration = {
  headerMode: 'screen',
  backBehavior: 'none',
  tabBarOptions: {
    activeTintColor: Colors.RED,
		style:{
      backgroundColor: 'white',
    } 
  }
}

export const LandlordTabBarNavigator = TabNavigator(routeConfiguration,tabBarConfiguration);

class LandlordTabBar extends React.Component {

  render(){
    const { dispatch, navigationState } = this.props;
    const addListener = createReduxBoundAddListener("root");

    return (
      <LandlordTabBarNavigator 
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
}


const mapStateToProps = (state) => {
 return {
    navigationState: state.landlordTabBar,
  }
}


export default connect(mapStateToProps)(LandlordTabBar)
