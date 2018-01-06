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
        return this.props.getProperty(this.props.property.id);
    })
    .then(() => {
        return this.props.navigation.goBack();
    })
    .catch((error) => {
        console.error(error);
    });
 }
  
  _goToProperty(){
  
    this.props.getProperty(this.props.property.id)
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
            property={this.props.property}
            reservation={this.props.reservation}
            user={this.props.user}
            cancelViewingReservation={(userId, reservationId, navigation) =>{this._cancelViewingReservation(userId, reservationId, navigation)}}
            goToProperty={() => { this._goToProperty() }}
            showViewPropertyBtn={this.props.nav.index > 1 ? false : true}
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
        user: state.user,
        nav: state.guestViewingsNav
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingContainer);
