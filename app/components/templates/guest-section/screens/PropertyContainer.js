import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import Property from '../../shared/Property';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import { View, StyleSheet } from 'react-native';
import InteractionBlocker from '../../shared/InteractionBlocker';
import ErrorScreen from '../../shared/ErrorScreen';

class PropertyContainer extends Component{

  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      showErrorScreen: false,
      errorMessage: null
    }
  }

  _goToViewing(viewingId){
      this.setState({isLoading: true});
      this.props.getViewingReservations(this.props.user.info.id)
      .then(() => {
        return this.props.getViewing(viewingId);
      })
      .then((viewing) => {
        this.setState({isLoading: false});
        return this.props.navigation.navigate('PropertyViewing', { viewing: viewing, property: this.props.currentProperty});
      })
      .catch((e) => {
        console.log(e);
        this.setState({isLoading: false, showErrorScreen: true });
      })
    }
  
  _goBack(){
    return this.props.returnToGuestTabBar()
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
            goBack={() => {this._goBack()}}
            getProperty={this.props.getProperty}
            contactAgent={(message) => {this.props.navigation.navigate('CreateChatContainer', {recipients : [this.props.user.info, this.props.currentProperty.user], message: message })}}
            showContactAgent={this.props.user.info.id != this.props.currentProperty.user.id}
          />
          {
            !this.state.isLoading ? null :
            <InteractionBlocker />
          }
          {
            !this.state.showErrorScreen ? null :
            <ErrorScreen close={() => { this.setState({showErrorScreen: false, errorMessage: null})}} errorMessage={this.state.errorMessage} />
          }
          <NetworkErrorMessage isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
        </View>
    )
  }
}

const mapStateToProps = (state, navigation) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        currentProperty: state.properties.listings.find(p => p.id === navigation.navigation.state.params.property.id),
        currentPropertyViewings: state.properties.listings.find(p => p.id === navigation.navigation.state.params.property.id).viewings,
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