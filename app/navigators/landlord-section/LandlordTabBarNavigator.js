import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import LandlordHomeNavigator  from '../../components/templates/landlord-section/home-tab/Navigator';
import PropertiesScreen  from '../../components/templates/landlord-section/properties-tab/PropertiesScreen';



const routeConfiguration = {
  HomeTab: {
    screen: LandlordHomeNavigator
  },
  Properties: { 
    screen: PropertiesScreen
    
  }
}

const tabBarConfiguration = {
  headerMode: 'screen',
  backBehavior: 'none'
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
