import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import PropertyContainer from '../screens/PropertyContainer';
import ViewingContainer from '../screens/ViewingContainer';
import CreateChatContainer from '../screens/CreateChatContainer';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    PropertyScreen: { screen: PropertyContainer },
    PropertyViewings: { screen: ViewingContainer },
    CreateChatContainer: { screen: CreateChatContainer }
}

const stackConfiguration = {
  initialRoute: 'PropertyScreen',
  gesturesEnabled: false,
  navigationOptions: {
    header: null
  }
}

export const GuestFavouritesNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class GuestFavouritesTab extends React.Component {
    
    render(){
        const { navigationState, dispatch } = this.props;
        const addListener = createReduxBoundAddListener("root");

        return (
            <GuestFavouritesNavigator  
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
        navigationState: state.guestFavouritesNav
    }
}

export default connect(mapStateToProps)(GuestFavouritesTab)