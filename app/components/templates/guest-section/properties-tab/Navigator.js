import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropertiesScreen from './PropertiesScreen';
import PropertyContainer from './PropertyContainer';
import ViewingContainer from './ViewingContainer';
import OtherScreen from './OtherScreen';
import * as Colors from '../../../helpers/ColorPallette';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    PropertiesHome: { screen: PropertiesScreen },
    LiveCast: { screen: OtherScreen },
    PropertiesTabPropertyScreen: { screen: PropertyContainer },
    PropertiesTabViewing: { screen: ViewingContainer }
}

const stackConfiguration = {
  initialRoute: 'PropertiesHome',
  navigationOptions: {
    header: null
  }
}

export const GuestPropertiesNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class GuestProperitesTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: null,
        tabBarIcon: ({ tintColor }) => (
            <Icon name="home" size={24} color={tintColor} style={{height: 24, width: 24}} />
          )
    }

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