import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import Property from '../../shared/Property';
import * as Colors from '../../../helpers/ColorPallette';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import { View, StyleSheet, Text } from 'react-native';


class PropertyContainer extends Component{

  componentWillMount(){
   
    this.props.updateCurrentProperty(this.props.currentProperty);
    
    this.props.getViewingReservations(this.props.user.info.id)
    .catch((error) => {
      console.error(error);
    })
  }

  _goToViewing(viewingId){
      this.props.navigation.navigate('PropertyViewings', { viewingId: viewingId, property: this.props.currentProperty});
    }
  
  render() {
    return (
        <View style={styles.container}>
          <Property 
            currentProperty={this.props.currentProperty}
            properties={this.props.properties}
            propertyScreen={this.props.propertyScreen}
            goToViewing={(viewingId) => { return this._goToViewing(viewingId)}}
            updatePropertyActiveTab={(index) => { return this.props.updatePropertyActiveTab(index)}}
            goBack={() => {this.props.returnToGuestTabBar()}}
            getProperty={this.props.getProperty}
            contactAgent={() => {this.props.navigation.navigate('CreateChatContainer', {recipientIds : [this.props.user.info.id, this.props.currentProperty.user.id] })}}
            showContactAgent={this.props.user.info.id != this.props.currentProperty.user.id}
          />
          <NetworkErrorMessage isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
        </View>
    )
  }
}

PropertyContainer.navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.property.name}`,
    headerTintColor: Colors.RED,
    headerStyle: {  borderBottomWidth: 0, backgroundColor: 'white', shadowColor: 'white' }
  });
  

const mapStateToProps = (state, navigation) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        currentProperty: state.properties.propertiesList.find(p => p.id === navigation.navigation.state.params.property.id),
        currentPropertyViewings: state.properties.propertiesList.find(p => p.id === navigation.navigation.state.params.property.id).viewings,
        propertyScreen: state.propertyScreen,
        properties: state.properties,
        network: state.network
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});