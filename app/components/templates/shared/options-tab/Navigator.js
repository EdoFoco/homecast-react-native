import React from 'react';
import { addNavigationHelpers, StackNavigator  } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import OptionsScreen from './OptionsScreen';

const routeConfiguration = {
    OptionsHome: { screen: OptionsScreen }
}

const stackConfiguration = {
  initialRoute: 'OptionsHome',
}

export const OptionsNavigator = StackNavigator(routeConfiguration, stackConfiguration);

class OptionsTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: 'Options',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="cog" size={22} color={tintColor} />
          )
    }

    render(){
        const { navigationState, dispatch } = this.props;
        
        return (
            <OptionsNavigator  
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
        navigationState: state.optionsNav
    }
}

export default connect(mapStateToProps)(OptionsTab)