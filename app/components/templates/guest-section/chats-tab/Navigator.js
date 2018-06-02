import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ChatContainer from '../screens/ChatContainer';
import * as Colors from '../../../helpers/ColorPallette';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    Chat: { screen: ChatContainer }
}

const stackConfiguration = {
  initialRoute: 'ChatsHome',
  navigationOptions: {
    headerTintColor: Colors.RED,
    headerStyle: {
      backgroundColor: 'white'
    }
  }
}

export const GuestChatsNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class GuestChatsTab extends React.Component {
    
    render(){
        const { navigationState, dispatch } = this.props;
        const addListener = createReduxBoundAddListener("root");

        return (
            <GuestChatsNavigator  
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
        navigationState: state.guestChatsNav
    }
}

export default connect(mapStateToProps)(GuestChatsTab)