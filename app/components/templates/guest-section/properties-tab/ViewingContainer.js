import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import ViewingScreen from '../../shared/ViewingScreen';
import { NavigationActions } from 'react-navigation';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import { View, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';

class ViewingContainer extends Component{

 _reserveSpot(userId, viewingId){
    return this.props.createViewingReservation(userId, viewingId)
    .then(() => {
        return this.props.getProperty(this.props.property.id);
    })
    .then(() => {
        //Build notification
        // const notification = new firebase.notifications.Notification();

        // // Schedule the notification for 1 minute in the future
        // const date = new Date();
        // date.setMinutes(date.getMinutes() + 1);

        // firebase.notifications().scheduleNotification(notification, {
        //     fireDate: date.getTime(),
        // })
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
        <View style={styles.container}>
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
            <NetworkErrorMessage isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
        </View>
       
    )
  }
}


ViewingContainer.navigationOptions = function({navigation}) {
    console.log(navigation);
    return { title: `Viewing - ${navigation.state.params.property.name}` }
};


const mapStateToProps = (state, {navigation}) => {
    let property = state.properties.propertiesList.find(p => p.id === navigation.state.params.property.id);
    return {
        property: property,
        viewing: property.viewings.find(v => v.id === navigation.state.params.viewingId),
        reservation: state.viewings.viewingReservations.find(r => r.viewing.id === navigation.state.params.viewingId),
        user: state.user,
        network: state.network
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingContainer);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'white',
    }
  });