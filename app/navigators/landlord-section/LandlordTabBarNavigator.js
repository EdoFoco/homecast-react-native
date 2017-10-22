import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import PropertiesNavigator  from '../../components/templates/landlord-section/properties-tab/Navigator';
import OptionsTab from '../../components/templates/shared/options-tab/Navigator';
import * as Colors from '../../components/helpers/ColorPallette';

const routeConfiguration = {
  Properties: { 
    screen: PropertiesNavigator
  },
  Options: {
    screen: OptionsTab
  }
}

const tabBarConfiguration = {
  headerMode: 'screen',
  backBehavior: 'none',
  tabBarOptions: {
    activeTintColor: Colors.PINK,
		style:{
      backgroundColor: 'white',
    } 
  }
}

export const LandlordTabBarNavigator = TabNavigator(routeConfiguration,tabBarConfiguration);

class LandlordTabBar extends React.Component {

  render(){
    const { dispatch, navigationState } = this.props
    return (
      <LandlordTabBarNavigator 
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
    navigationState: state.landlordTabBar,
  }
}


export default connect(mapStateToProps)(LandlordTabBar)
