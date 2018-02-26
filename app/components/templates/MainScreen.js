import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import  GuestTabBar  from '../../navigators/guest-section/GuestTabBarNavigator';
import  LandlordTabBar  from '../../navigators/landlord-section/LandlordTabBarNavigator';
import NetworkErrorMessage from '../templates/shared/NetworkErrorMessage';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import { addNavigationHelpers } from 'react-navigation';
import AuthForm from '../molecules/AuthForm';
import { AsyncStorage } from 'react-native';

class MainScreen extends Component {

  componentWillMount(){
   
    this.props.getLoggedInUser()
    .catch((error) => {
        console.warn(error);
        if(typeof error.response !== 'undefined'){
            if(error.response.status == 401){
                return this.props.handleUnauthorized();
            }
        }
       return this.props.handleUnauthorized();
    })
    .then(() => {
      return this.props.updateAuthenticatingState(false);
    });
  }

  render(){
    if(this.props.isLoggedIn){
      if(this.props.section.sectionName === 'guest'){
        return(
            <GuestTabBar />
        )
      }
      if(this.props.section.sectionName === 'landlord'){
        return(
            <LandlordTabBar />
          )
      }
    }
    return(
      <View style={styles.container}>
        <AuthForm />
        <NetworkErrorMessage  isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
      </View>      
    )
  }
}


MainScreen.navigationOptions = {
  title: 'Home Screen',
};

const mapStateToProps = (state) => {
    console.log('Main Screen Section');
    console.log(state);
    return {
        isLoggedIn: state.user.isLoggedIn,
        isAuthenticating: state.user.isAuthenticating,
        nav: state.nav,
        section: state.section,
        network: state.network
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});