import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import OptionsScreen from './OptionsScreen';
import * as Colors from '../../../helpers/ColorPallette';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const routeConfiguration = {
    OptionsHome: { screen: OptionsScreen }
}

const stackConfiguration = {
  initialRoute: 'OptionsHome',
  navigationOptions: {
    headerTintColor: Colors.RED,
    headerStyle: {
      backgroundColor: 'white',
    }
  }
}

export const OptionsNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class OptionsTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: 'Options',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="cog" size={22} color={tintColor} style={{height: 22, width: 22}} />
          )
    }

    render(){
        const { navigationState, dispatch } = this.props;
        const addListener = createReduxBoundAddListener("root");

        return (
            <OptionsNavigator  
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
        navigationState: state.optionsNav
    }
}

export default connect(mapStateToProps)(OptionsTab)