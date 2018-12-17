import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import ViewingScreen from '../../shared/ViewingScreen';
import GAClient from '../../../../libs/third-party/GoogleAnalytics/ga';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import { View, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';

class ViewingContainer extends Component{

 _reserveSpot(userId, viewingId){
    return this.props.createViewingReservation(userId, viewingId)
    .then(() => {
        return this.props.getPropertyViewing(this.props.viewing.id);
    })
    .then(() => {
        return this._setNotifications();
    })
    .catch((error) => {
        console.error(error);
    });
 }

_setNotifications(){
    // Build notification
    let notification1 = new firebase.notifications.Notification()
    .setNotificationId(`Viewing-${this.props.viewing.id}-15min`)
    .setTitle(this.props.property.name)
    .setBody(`Live viewing will start in 15min`)
    .setSound('default')
    .setData({
        path: `homecast://guest/properties/${this.props.property.id}/viewings/${this.props.viewing.id}`
    });

    const date1 = new Date(this.props.viewing.date_time);
    date1.setMinutes(date1.getMinutes() - 15);

    let notification2 = new firebase.notifications.Notification()
    .setNotificationId(`Viewing-${this.props.viewing.id}-5min`)
    .setTitle(this.props.property.name)
    .setBody(`Live viewing will start in 5min`)
    .setSound('default')
    .setData({
        path: `homecast://guest/properties/${this.props.property.id}/viewings/${this.props.viewing.id}`
    });

    const date2 = new Date(this.props.viewing.date_time);
    date2.setMinutes(date2.getMinutes() - 5);

    return firebase.notifications().scheduleNotification(notification1, {
        fireDate: date1.getTime(),
    })
    .then(() => {
        return firebase.notifications().scheduleNotification(notification2, {
            fireDate: date2.getTime()
        });
    });
}
    
_cancelNotifications(){
    firebase.notifications().cancelNotification(`Viewing-${this.props.viewing.id}-5min`);
    firebase.notifications().cancelNotification(`Viewing-${this.props.viewing.id}-15min`);
}

 _cancelViewingReservation(userId, reservationId){
    return this.props.cancelViewingReservation(userId, reservationId)
    .then(() => {
        return this.props.getPropertyViewing(this.props.viewing.id);
    })
    .then(() => {
        this._cancelNotifications();
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
    GAClient.gaClientInstance.trackClientViewingStarted(this.props.user.info.id, this.props.viewing.id);
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
                getProperty={this.props.getProperty}
                joinLiveCast={() => {this._joinLiveCast()}}
                navigation={this.props.navigation}
                goBack={() => {this.props.navigation.goBack()}}
                contactAgent={() => {this.props.navigation.navigate('CreateChatContainer', {recipientIds : [this.props.user.info.id, this.props.property.user.id] })}}
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
        viewing: navigation.state.params.viewing,
        reservation: state.viewings.viewingReservations.find(r => r.viewing.id === navigation.state.params.viewing.id),
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