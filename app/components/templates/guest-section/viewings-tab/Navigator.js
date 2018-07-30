import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import ViewingContainer from '../screens/ViewingContainer';
import CreateChatContainer from '../screens/CreateChatContainer';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    ViewingScreen: { screen: ViewingContainer },
    CreateChatContainer: { screen: CreateChatContainer }
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
        navigationState: state.viewingsNav
    }
}

export default connect(mapStateToProps)(GuestViewingsTab)