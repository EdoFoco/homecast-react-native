import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewingsScreen from './ViewingsScreen';
import ViewingContainer from './ViewingContainer';
import PropertyContainer from './PropertyContainer';
import * as Colors from '../../../helpers/ColorPallette';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    ViewingsHome: { screen: ViewingsScreen },
    Viewing: { screen: ViewingContainer },
    ViewingProperty: { screen: PropertyContainer}
}

const stackConfiguration = {
  initialRoute: 'ViewingsHome',
  navigationOptions: {
    headerTintColor: Colors.RED,
    headerStyle: {
      backgroundColor: 'white'
    }
  }
}

export const GuestViewingsNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class GuestViewingsTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: 'Viewings',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="calendar-clock" size={22} color={tintColor} style={{height: 22, width: 22}} />
          ),
        showIcon: true
    }

    render(){
        const { navigationState, dispatch } = this.props;
        const addListener = createReduxBoundAddListener("root");

        return (
            <GuestViewingsNavigator  
                navigation={
                addNavigationHelpers({
                    dispatch: dispatch,
                    state: navigationState,
                    addListener
                })
            } />
        );  
      }
}

const mapStateToProps = (state) => {
    return {
        navigationState: state.guestViewingsNav
    }
}

export default connect(mapStateToProps)(GuestViewingsTab)