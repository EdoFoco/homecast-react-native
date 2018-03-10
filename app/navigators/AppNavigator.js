import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import MainScreen from '../components/templates/MainScreen';


const navigatorOptions = {
  navigationOptions:{
    header: null
  }
};

export const AppNavigator = StackNavigator({
  Main: { screen: MainScreen },
}, navigatorOptions);


const AppWithNavigationState = function({ dispatch, nav, addListener }) { 
  
  return(
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav, addListener, })} />
  )
};


AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
  addListener: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
