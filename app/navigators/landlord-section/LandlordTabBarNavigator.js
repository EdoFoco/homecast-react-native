import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import PropertiesScreen from '../../components/templates/landlord-section/properties-tab/PropertiesScreen';
import OptionsTab from '../../components/templates/shared/options-tab/Navigator';
import ViewingsContainer from '../../components/templates/landlord-section/viewings-tab/ViewingsContainer';
import * as Colors from '../../components/helpers/ColorPallette';
import ChatsContainer from '../../components/templates/guest-section/chats-tab/ChatsContainer';
import {
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';

const routeConfiguration = {
  PropertiesTab: { 
    screen: PropertiesScreen
  },
  ChatsTab: {
    screen: ChatsContainer
  },
  ViewingsTab: {
    screen: ViewingsContainer
  },
  OptionsTab: {
    screen: OptionsTab
  }
}

const tabBarConfiguration = {
  headerMode: 'screen',
  backBehavior: 'none',
  tabBarOptions: {
    activeTintColor: Colors.AQUA_GREEN,
    inactiveTintColor: Colors.WHITE_SMOKE,
    showLabel: false,
		style:{
      backgroundColor: Colors.DARK_BLUE,
      height: 60
    } 
  }
}

export const LandlordTabBarNavigator = TabNavigator(routeConfiguration,tabBarConfiguration);

class LandlordTabBar extends React.Component {

  render(){
    const { dispatch, navigationState } = this.props;
    const addListener = createReduxBoundAddListener("root");

    return (
      <LandlordTabBarNavigator 
        navigation={
          addNavigationHelpers({
            dispatch: dispatch,
            state: navigationState,
            addListener
          })
        }
      />
    )
  }
}


const mapStateToProps = (state) => {
 return {
    navigationState: state.landlordTabBar,
  }
}


export default connect(mapStateToProps)(LandlordTabBar)
