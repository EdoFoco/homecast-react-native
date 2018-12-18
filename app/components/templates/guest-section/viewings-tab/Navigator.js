import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import ViewingReservationContainer from './ViewingReservationContainer';
import CreateChatContainer from '../screens/CreateChatContainer';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import LiveCastContainer from '../screens/LiveCastContainer';
import PropertyContainer from './PropertyContainer';
import ViewingContainer from '../screens/ViewingContainer';

const routeConfiguration = {
    ViewingScreen: { screen: ViewingReservationContainer },
    CreateChatContainer: { screen: CreateChatContainer },
    LiveCast: { screen: LiveCastContainer },
    PropertyScreen: { screen: PropertyContainer},
    PropertyViewing: { screen: ViewingContainer }
}

const stackConfiguration = {
  initialRoute: 'ViewingScreen',
  navigationOptions: {
    header: null
  }
}

export const GuestViewingsNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class GuestViewingsTab extends React.Component {
    
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