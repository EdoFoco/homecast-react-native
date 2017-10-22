import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropertiesScreen from './PropertiesScreen';
import PropertyScreen from '../../shared/PropertyScreen';

const routeConfiguration = {
    PropertiesHome: { screen: PropertiesScreen },
    PropertyScreen: { screen: PropertyScreen }
}

const stackConfiguration = {
  initialRoute: 'PropertiesHome',
}

export const LandlordPropertiesNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class LandlordProperitesTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: 'Properties',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="home" size={22} color={tintColor} />
          )
    }

    render(){
        const { navigationState, dispatch } = this.props;
        
        return (
            <LandlordPropertiesNavigator  
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
        navigationState: state.landlordPropertiesNav
    }
}

export default connect(mapStateToProps)(LandlordProperitesTab)