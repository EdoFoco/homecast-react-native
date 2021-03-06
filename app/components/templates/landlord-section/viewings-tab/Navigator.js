import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import ViewingContainer from './ViewingContainer';
import LiveCastContainer from '../screens/LiveCastContainer';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    ViewingScreen: { screen: ViewingContainer },
    LiveCast: { screen: LiveCastContainer, navigationOptions: { tabBarVisible: false, header: null } }
}

const stackConfiguration = {
  initialRoute: 'ViewingScreen',
  navigationOptions: {
    header: null
  }
}

export const LandlordViewingsNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class LandlordViewingsTab extends React.Component {
    
    render(){
        const { navigationState, dispatch } = this.props;
        const addListener = createReduxBoundAddListener("root");

        return (
            <LandlordViewingsNavigator  
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
        navigationState: state.landlordViewingsNav
    }
}

export default connect(mapStateToProps)(LandlordViewingsTab)
