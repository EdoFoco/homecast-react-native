import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Colors from '../../../helpers/ColorPallette';
import PropertiesScreen from './PropertiesScreen';
import AddPropertyScreen from './AddPropertyScreen';
import EditPropertyScreen from './EditPropertyScreen';
import ViewingContainer from './ViewingContainer';

const routeConfiguration = {
    PropertiesHome: { screen: PropertiesScreen },
    EditPropertyScreen: { screen: EditPropertyScreen },
    AddPropertyScreen: { screen: AddPropertyScreen },
    ViewingScreen: { screen: ViewingContainer }
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