import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import ProfileScreen from '../components/templates/ProfileScreen';
import GuestHomeNavigator from './GuestSection/HomeNavigator';



const routeConfiguration = {
  //Home2: { screen: GuestScreen },
  Home: {screen: GuestHomeNavigator}
  //Viewings: { screen: ViewingsScreen },
}

const tabBarConfiguration = {
    initialRoute: 'Home',
    tabBarOptions:{
        activeTintColor: 'white',
        inactiveTintColor: 'blue',
        activeBackgroundColor: 'blue',
        inactiveBackgroundColor: 'white',
  }
}

export const GuestTabBarNavigator = TabNavigator(routeConfiguration,tabBarConfiguration);

const GuestTabBar = ({ dispatch, nav }) => (
  <GuestTabBarNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

GuestTabBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(GuestTabBar);
