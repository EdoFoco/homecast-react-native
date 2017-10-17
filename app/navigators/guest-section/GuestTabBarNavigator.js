import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import FavouritesNavigator  from '../../components/templates/guest-section/favourites-tab/Navigator';
import PropertiesNavigator  from '../../components/templates/guest-section/properties-tab/Navigator';
import OptionsScreen  from '../../components/templates/shared/OptionsScreen';



const routeConfiguration = {
  Properties: { 
    screen: PropertiesNavigator
  },
  FavouritesTab: {
    screen: FavouritesNavigator
  },
  Options: {
    screen: OptionsScreen
  }
}

const tabBarConfiguration = {
  headerMode: 'screen',
  backBehavior: 'none',
}

export const GuestTabBarNavigator = TabNavigator(routeConfiguration,tabBarConfiguration);

class GuestTabBar extends React.Component {

  render(){
    const { dispatch, navigationState } = this.props
    return (
      <GuestTabBarNavigator 
        navigation={
          addNavigationHelpers({
            dispatch: dispatch,
            state: navigationState
          })
        }
      />
    )
  }
}


const mapStateToProps = (state) => {
 return {
    navigationState: state.guestTabBar,
  }
}


export default connect(mapStateToProps)(GuestTabBar)
