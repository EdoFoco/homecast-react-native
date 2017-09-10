import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { GuestViewingsNavigator } from '../../../../navigators/guest-section/ViewingsNavigator';
import { connect } from 'react-redux';

class GuestViewingsTab extends React.Component {
    
    static navigationOptions = {
        tabBarLabel: 'Properties'
    }


    render(){
        const { navigationState, dispatch } = this.props;
        
        return (
            <GuestViewingsNavigator  
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
        navigationState: state.guestViewingsNav
    }
}

export default connect(mapStateToProps)(GuestViewingsTab)