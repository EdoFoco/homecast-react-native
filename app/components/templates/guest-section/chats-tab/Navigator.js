import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ChatsContainer from './ChatsContainer';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Colors from '../../../helpers/ColorPallette';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    ChatsHome: { screen: ChatsContainer }
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
    
    static navigationOptions = {
        tabBarLabel: 'Chats',
        tabBarIcon: ({ tintColor }) => (
            <MCIcon name="message-outline"  size={24} color={tintColor} style={{height: 24, width: 24}} />
          )
    }

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