import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropertiesScreen from './PropertiesScreen';
import PropertyScreen from '../../shared/PropertyScreen';
import ViewingScreen from '../../shared/ViewingScreen';
import OtherScreen from './OtherScreen';
import * as Colors from '../../../helpers/ColorPallette';

const routeConfiguration = {
    PropertiesHome: { screen: PropertiesScreen },
    Other: { screen: OtherScreen },
    PropertyScreen: { screen: PropertyScreen },
    //ViewingScreen: { screen: ViewingScreen }
}

const stackConfiguration = {
  initialRoute: 'PropertiesHome',
  navigationOptions: {
    headerTintColor: Colors.RED,
    headerStyle: {
      backgroundColor: 'white'
    }
  }
}

export const GuestPropertiesNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class GuestProperitesTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: 'Properties',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="home" size={22} color={tintColor} />
          )
    }

    render(){
        const { navigationState, dispatch } = this.props;
        
        return (
            <GuestPropertiesNavigator  
                navigation={
                addNavigationHelpers({
                    dispatch: dispatch,
                    state: navigationState
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