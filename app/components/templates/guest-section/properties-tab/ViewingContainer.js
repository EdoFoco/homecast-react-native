import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import ViewingScreen from '../../shared/ViewingScreen';
import { NavigationActions } from 'react-navigation';

class ViewingContainer extends Component{

_reserveSpot(userId, viewingId){
    return this.props.createViewingReservation(userId, viewingId)
    .then(() => {
        return this.props.getViewing(this.props.viewing.id);
    })
    .then(() => {
        return this.props.getViewingReservations(userId);
    })
    .catch((error) => {
        console.error(error);
    });
}
    
 _cancelViewingReservation(userId, reservationId, navigation){
    return this.props.cancelViewingReservation(userId, reservationId)
    .then(() => {
        return this.props.navigation.goBack();
    })
    .catch((error) => {
        console.error(error);
    });
 }
  
  _goToProperty(){
    return this.props.getProperty(this.props.viewing.property.id)
    .then((property) => {
        this.props.navigation.goBack();
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
            cancelViewingReservation={(userId, reservationId) => {this._cancelViewingReservation(userId, reservationId)}}
            createViewingReservation={(userId, viewingId) => {this._reserveSpot(userId, viewingId)} }
            goToProperty={() => { this._goToProperty() }}
            showViewPropertyBtn={true}
       />
    )
  }
}


ViewingContainer.navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.viewing.property.name}`,
});


const mapStateToProps = (state, {navigation}) => {
    return {
        viewing: state.properties.currentPropertyViewings.find(v => v.id === navigation.state.params.viewing.id),
        user: state.user
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingContainer);
