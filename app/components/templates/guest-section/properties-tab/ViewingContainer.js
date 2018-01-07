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
        return this.props.getProperty(this.props.property.id);
    })
    .catch((error) => {
        console.error(error);
    });
 }
        
    
 _cancelViewingReservation(userId, reservationId, navigation){
    return this.props.cancelViewingReservation(userId, reservationId)
    .then(() => {
        return this.props.getProperty(this.props.property.id);
    })
    .catch((error) => {
        console.error(error);
    });
 }
  
  _goToProperty(){
    return this.props.getProperty(this.props.property.id)
    .then((property) => {
        this.props.navigation.goBack();
    })
    .catch((error) => {
        console.error(error);
    });
  }

  _joinLiveCast(){
    this.props.navigation.navigate('LiveCast', { viewing: this.props.viewing});
  }

  render() {
    return(
       <ViewingScreen 
            viewing={this.props.viewing}
            property={this.props.property}
            reservation={this.props.reservation}
            user={this.props.user}
            cancelViewingReservation={(userId, reservationId) => {this._cancelViewingReservation(userId, reservationId)}}
            createViewingReservation={(userId, viewingId) => {this._reserveSpot(userId, viewingId)} }
            goToProperty={() => { this._goToProperty() }}
            showViewPropertyBtn={true}
            joinLiveCast={() => {this._joinLiveCast()}}
       />
    )
  }
}


ViewingContainer.navigationOptions = ({ navigation }) => ({
    title: `Viewing - ${navigation.state.params.property.name}`,
});


const mapStateToProps = (state, {navigation}) => {
    let property = state.properties.propertiesList.find(p => p.id === navigation.state.params.property.id);
    return {
        property: property,
        viewing: property.viewings.find(v => v.id === navigation.state.params.viewingId),
        reservation: state.viewings.viewingReservations.find(r => r.viewing.id === navigation.state.params.viewingId),
        user: state.user
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingContainer);
