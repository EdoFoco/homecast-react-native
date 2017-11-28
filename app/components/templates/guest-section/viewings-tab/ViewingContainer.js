import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import ViewingScreen from '../../shared/ViewingScreen';
import { NavigationActions } from 'react-navigation';

class ViewingContainer extends Component{

 _cancelViewingReservation(userId, reservationId, navigation){
    return this.props.cancelViewingReservation(userId, reservationId)
    .then(() => {
        return this.props.getViewingReservations(this.props.user.info.id);
    })
    .then(() => {
        return this.props.resetViewingsTab();
    })
    .catch((error) => {
        console.error(error);
    });
 }
  
  _goToProperty(){
  
    this.props.getProperty(this.props.viewing.property.id)
    .then((property) => {
        this.props.navigation.navigate('ViewingProperty', { property : property});
    })
    .catch((error) => {
        console.error(error);
    });
  }

  render() {
    return(
       <ViewingScreen 
            viewing={this.props.viewing}
            user={this.props.user}
            cancelViewingReservation={(userId, reservationId, navigation) =>{this._cancelViewingReservation(userId, reservationId, navigation)}}
            goToProperty={() => { this._goToProperty() }}
            showViewPropertyBtn={this.props.nav.index > 1 ? false : true}
       />
    )
  }
}


ViewingContainer.navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.viewing.property.name}`,
});


const mapStateToProps = (state, {navigation}) => {
    return {
        viewing: navigation.state.params.viewing,
        user: state.user,
        nav: state.guestViewingsNav
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingContainer);
