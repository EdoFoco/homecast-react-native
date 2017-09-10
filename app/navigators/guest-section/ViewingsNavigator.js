import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import PropertiesScreen from '../../components/templates/guest-section/viewings-tab/PropertiesScreen';
import PropertyScreen from '../../components/templates/guest-section/viewings-tab/PropertyScreen';
import ViewingsScreen from '../../components/templates/guest-section/viewings-tab/ViewingsScreen';
import OtherScreen from '../../components/templates/guest-section/viewings-tab/OtherScreen';


const routeConfiguration = {
      PropertiesHome: { screen: PropertiesScreen },
      ViewingsScreen: { screen: ViewingsScreen },
      Other: { screen: OtherScreen },
      PropertyScreen: { screen: PropertyScreen }
}

const stackConfiguration = {
    initialRoute: 'PropertiesHome',
}

export const GuestViewingsNavigator = StackNavigator(routeConfiguration, stackConfiguration);
