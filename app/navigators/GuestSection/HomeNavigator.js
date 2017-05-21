import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import HomeScreen from '../../components/templates/GuestSection/HomeScreen';
import ViewingsScreen from '../../components/templates/GuestSection/ViewingsScreen';


const routeConfiguration = {
      Home: { screen: HomeScreen },
      Viewings: { screen: ViewingsScreen }

//  Guest: { screen: HomeScreen },
}

const stackConfiguration = {
    initialRoute: 'Viewings'
}

export const GuestHomeNavigator = StackNavigator(routeConfiguration, stackConfiguration);
/*
const GuestHomeStack = ({ dispatch, nav }) => (
  <GuestHomeNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);


const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(GuestHomeStack);
*/