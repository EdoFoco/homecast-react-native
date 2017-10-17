import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import FavouritesScreen from './FavouritesScreen';


const routeConfiguration = {
    FavouritesHome: { screen: FavouritesScreen }
}

const stackConfiguration = {
  initialRoute: 'FavouritesHome',
}

export const GuestFavouritesNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class GuestFavouritesTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: 'Favourites',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="heart" size={30} color={tintColor} />
          )
    }

    render(){
        const { navigationState, dispatch } = this.props;
        
        return (
            <GuestFavouritesNavigator  
                navigation={
                addNavigationHelpers({
                    dispatch: dispatch,
                    state: navigationState
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