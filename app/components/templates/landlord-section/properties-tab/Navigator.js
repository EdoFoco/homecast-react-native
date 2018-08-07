import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Colors from '../../../helpers/ColorPallette';
import AddPropertyScreen from './AddPropertyScreen';
import EditPropertyScreen from './EditPropertyScreen';
import ViewingContainer from '../screens/ViewingContainer';
import LiveCastContainer from '../screens/LiveCastContainer';
import UploadPhotosScreen from './UploadPhotosScreen';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    EditPropertyScreen: { screen: EditPropertyScreen },
    AddPropertyScreen: { screen: AddPropertyScreen },
    ViewingScreen: { screen: ViewingContainer },
    UploadPhotosScreen: { screen: UploadPhotosScreen },
    LiveCast: { screen: LiveCastContainer, navigationOptions: { tabBarVisible: false, header: null } }
}

const stackConfiguration = {
  initialRoute: 'EditPropertyScreen',
  navigationOptions: {
    headerTintColor: Colors.RED,
    headerStyle: {
      backgroundColor: Colors.DARK_BLUE
    }
  }
}

export const LandlordPropertiesNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class LandlordProperitesTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: 'Properties',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="home" size={22} color={tintColor} style={{height: 22, width: 22}} />
          )
    }

    render(){
        const { navigationState, dispatch } = this.props;
        const addListener = createReduxBoundAddListener("root");

        return (
            <LandlordPropertiesNavigator  
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
        navigationState: state.landlordPropertiesNav
    }
}

export default connect(mapStateToProps)(LandlordProperitesTab)