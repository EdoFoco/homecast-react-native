import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import ViewingContainer from '../../guest-section/screens/ViewingContainer';
//import CreateChatContainer from '../screens/CreateChatContainer';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    ViewingScreen: { screen: ViewingContainer },
    //CreateChatContainer: { screen: CreateChatContainer }
}

const stackConfiguration = {
  initialRoute: 'ViewingScreen',
  navigationOptions: {
    header: null
  }
}

export const LandlordViewingsNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class LandlordViewingsTab extends React.Component {
    
    render(){
        const { navigationState, dispatch } = this.props;
        const addListener = createReduxBoundAddListener("root");

        return (
            <LandlordViewingsNavigator  
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

export default connect(mapStateToProps)(LandlordViewingsTab)