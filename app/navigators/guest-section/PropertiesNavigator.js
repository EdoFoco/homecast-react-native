import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import PropertiesScreen from '../../components/templates/guest-section/properties-tab/PropertiesScreen';
import PropertyScreen from '../../components/templates/guest-section/properties-tab/PropertyScreen';
import ViewingsScreen from '../../components/templates/guest-section/properties-tab/ViewingsScreen';
import OtherScreen from '../../components/templates/guest-section/properties-tab/OtherScreen';


const routeConfiguration = {
      PropertiesHome: { screen: PropertiesScreen },
      ViewingsScreen: { screen: ViewingsScreen },
      Other: { screen: OtherScreen },
      PropertyScreen: { screen: PropertyScreen }
}

const stackConfiguration = {
    initialRoute: 'PropertiesHome',
}

export const GuestPropertiesNavigator = StackNavigator(routeConfiguration, stackConfiguration);
