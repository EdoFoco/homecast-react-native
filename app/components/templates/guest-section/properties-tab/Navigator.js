import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { GuestPropertiesNavigator } from '../../../../navigators/guest-section/PropertiesNavigator';
import { connect } from 'react-redux';

class GuestProperitesTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: 'Properties'
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