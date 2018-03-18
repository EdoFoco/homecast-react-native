import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import FavouritesScreen from './FavouritesScreen';
import PropertyContainer from './PropertyContainer';
import ViewingContainer from './ViewingContainer';
import * as Colors from '../../../helpers/ColorPallette';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    FavouritesHome: { screen: FavouritesScreen },
    PropertyScreen: { screen: PropertyContainer },
    FavouritesViewingScreen: { screen: ViewingContainer }
}

const stackConfiguration = {
  initialRoute: 'FavouritesHome',
  navigationOptions: {
    header: null
  }
}

export const GuestFavouritesNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class GuestFavouritesTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: 'Favourites',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="heart" size={22} color={tintColor} style={{height: 22, width: 22}}/>
        )
    }

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