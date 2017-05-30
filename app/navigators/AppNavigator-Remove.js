import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import LoginScreen from '../components/templates/LoginScreen';
import MainScreen from '../components/templates/MainScreen';
import ProfileScreen from '../components/templates/ProfileScreen';

import GuestTabBar from './guest-section/GuestTabBarNavigator';

const navigatorOptions = {
  navigationOptions:{
    header: null
  }
};

export const AppNavigator = StackNavigator({
  Main: { screen: MainScreen },
  //Guest: { screen: GuestTabBar },
}, navigatorOptions);


const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
