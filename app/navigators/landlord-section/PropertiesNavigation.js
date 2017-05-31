import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import PropertiesNavigation from '../../components/templates/guest-section/viewings-tab/ViewingsScreen';
import OtherScreen from '../../components/templates/guest-section/viewings-tab/OtherScreen';


const routeConfiguration = {
      Home: { screen: ViewingsScreen },
}

const stackConfiguration = {
    initialRoute: 'Viewings',
}

export const PropertiesNavigator = StackNavigator(routeConfiguration, stackConfiguration);
