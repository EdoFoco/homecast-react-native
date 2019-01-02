import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import GuestRootNav from '../../navigators/guest-section/GuestRootNavigator';
import LandlordRootNav  from '../../navigators/landlord-section/LandlordRootNavigator';
import NetworkErrorMessage from '../templates/shared/NetworkErrorMessage';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import AuthForm from '../molecules/AuthForm';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Module WebRTCModule', 'Module RNInCallManager', 'Remote debugger']);
import SplashScreen from 'react-native-splash-screen';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


class MainScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { 
        isReady: false,
        error: null
     };
  }

  componentDidMount(){
    SplashScreen.hide()
  }

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
      if(this.props.section.sectionName == 'guest'){
        return this.props.getProperties();
      }
      else{
        return(this.props.getUserProperties(this.props.user.id));
      }
    })
    .then(() => {
      return this.props.updateAuthenticatingState(false);
    })
    .then(() => {
      this.setState({isReady: true})
    })
    .catch((e) => {
      console.error(e);
      this.setState({error: e})
      this.setState({isReady: true})
    });
  }

  render(){
    if(this.props.isLoggedIn && this.state.isReady){
      if(this.props.section.sectionName === 'guest'){
        return(
            <GuestRootNav addListener={this.props.addListener} />
        )
      }
      if(this.props.section.sectionName === 'landlord'){
        return(
            <LandlordRootNav addListener={this.props.addListener} />
        )
      }
    }
    if(this.state.isReady){
      return(
        <View style={styles.container}>
          <AuthForm />
          <NetworkErrorMessage  isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
        </View>      
      )
    }
    return(
      <Text>Loading.. Is Loading: {this.state.isReady.toString()}, isLoggedIn: {this.props.isLoggedIn.toString()}</Text>
    )
  }
}


MainScreen.navigationOptions = {
  title: 'Home Screen',
};

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        isAuthenticating: state.user.isAuthenticating,
        nav: state.nav,
        section: state.section,
        network: state.network,
        user: state.user.info
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