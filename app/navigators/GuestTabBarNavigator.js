import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import ProfileScreen from '../components/templates/ProfileScreen';
import GuestHomeNavigator  from '../components/templates/GuestSection/HomeTab/Navigator';



const routeConfiguration = {
  //Home2: { screen: GuestScreen },
  HomeTab: {screen: GuestHomeNavigator},
  //Profile: { screen: ProfileScreen },
}

const tabBarConfiguration = {
    //initialRoute: 'Viewings',
    tabBarOptions:{
        activeTintColor: 'white',
        inactiveTintColor: 'blue',
        activeBackgroundColor: 'blue',
        inactiveBackgroundColor: 'white',
  }
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
            state: navigationState,
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


/*const GuestTabBar = ({ dispatch, nav }) => (
  <GuestTabBarNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

GuestTabBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(GuestTabBar);
*/