import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import HomeScreen from '../../components/templates/landlord-section/home-tab/HomeScreen';
import PropertyScreen from '../../components/templates/guest-section/home-tab/PropertyScreen';


const routeConfiguration = {
      Home: { 
          screen: HomeScreen,
         }
      //Property: { screen: PropertyScreen }
}

const stackConfiguration = {
    initialRoute: 'Home',
}

export const LandlordHomeNavigator = StackNavigator(routeConfiguration, stackConfiguration);
