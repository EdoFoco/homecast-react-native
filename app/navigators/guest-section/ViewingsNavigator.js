import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import ViewingsScreen from '../../components/templates/guest-section/viewings-tab/ViewingsScreen';
import OtherScreen from '../../components/templates/guest-section/viewings-tab/OtherScreen';


const routeConfiguration = {
      ViewingsHome: { screen: ViewingsScreen },
      Other: { screen: OtherScreen },
}

const stackConfiguration = {
    initialRoute: 'ViewingsHome',
}

export const GuestViewingsNavigator = StackNavigator(routeConfiguration, stackConfiguration);
