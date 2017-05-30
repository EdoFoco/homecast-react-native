import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';
import GuestHomeNavigator  from '../../components/templates/guest-section/home-tab/Navigator';
import GuestViewingsNavigator  from '../../components/templates/guest-section/viewings-tab/Navigator';



const routeConfiguration = {
  HomeTab: {
    screen: GuestHomeNavigator
  },
  Viewings: { 
    screen: GuestViewingsNavigator
    
  },
}

const tabBarConfiguration = {
  headerMode: 'screen',
  backBehavior: 'none'
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