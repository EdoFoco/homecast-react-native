import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropertiesScreen from './PropertiesScreen';
import PropertyScreen from './PropertyScreen';
import ViewingsScreen from './ViewingsScreen';
import OtherScreen from './OtherScreen';

const routeConfiguration = {
    PropertiesHome: { screen: PropertiesScreen },
    ViewingsScreen: { screen: ViewingsScreen },
    Other: { screen: OtherScreen },
    PropertyScreen: { screen: PropertyScreen }
}

const stackConfiguration = {
  initialRoute: 'PropertiesHome',
}

export const GuestPropertiesNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class GuestProperitesTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: 'Properties',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="home" size={30} color={tintColor} />
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