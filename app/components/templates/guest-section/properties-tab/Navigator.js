import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import PropertiesScreen from './PropertiesScreen';
import PropertyContainer from '../screens/PropertyContainer';
import ViewingContainer from '../screens/ViewingContainer';
import LiveCastContainer from '../screens/LiveCastContainer';
import * as Colors from '../../../helpers/ColorPallette';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    LiveCast: { screen: LiveCastContainer },
    PropertiesPropertyScreen: { screen: PropertyContainer },
    PropertyViewings: { screen: ViewingContainer }
}

const stackConfiguration = {
  initialRoute: 'PropertiesPropertyScreen',
  navigationOptions: {
    header: null,
  }
}

export const GuestPropertiesNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class GuestProperitesTab extends React.Component {
    
    render(){
        const { navigationState, dispatch } = this.props;
        const addListener = createReduxBoundAddListener("root");

        return (
            <GuestPropertiesNavigator  
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
        navigationState: state.guestPropertiesNav
    }
}

export default connect(mapStateToProps)(GuestProperitesTab)