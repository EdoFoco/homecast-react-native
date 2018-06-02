import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import ViewingContainer from '../screens/ViewingContainer';
import PropertyContainer from '../screens/PropertyContainer';
import * as Colors from '../../../helpers/ColorPallette';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    ViewingScreen: { screen: ViewingContainer },
    PropertyViewings: { screen: ViewingContainer }
}

const stackConfiguration = {
  initialRoute: 'ViewingScreen',
  navigationOptions: {
    header: null
  }
}

export const GuestViewingsNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class GuestViewingsTab extends React.Component {
    
    render(){
        const { navigationState, dispatch } = this.props;
        const addListener = createReduxBoundAddListener("root");

        return (
            <GuestViewingsNavigator  
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
        navigationState: state.guestViewingsNav
    }
}

export default connect(mapStateToProps)(GuestViewingsTab)