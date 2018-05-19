import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import  GuestTabBar  from '../../navigators/guest-section/GuestTabBarNavigator';
import  LandlordTabBar  from '../../navigators/landlord-section/LandlordTabBarNavigator';
import NetworkErrorMessage from '../templates/shared/NetworkErrorMessage';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import { addNavigationHelpers } from 'react-navigation';
import AuthForm from '../molecules/AuthForm';
import { AsyncStorage } from 'react-native';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Module WebRTCModule', 'Module RNInCallManager', 'Remote debugger']);
import SplashScreen from 'react-native-splash-screen';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


class MainScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { 
        isReady: false
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
      return this.props.updateAuthenticatingState(false);
    })
    .then(() => {
      this.setState({isReady: true})
    })
    .catch((e) => {
      console.error(e);
    });
  }

  render(){
    if(this.props.isLoggedIn && this.state.isReady){
      if(this.props.section.sectionName === 'guest'){
        return(
            <GuestTabBar addListener={this.props.addListener} />
        )
      }
      if(this.props.section.sectionName === 'landlord'){
        return(
            <LandlordTabBar />
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
      <Text>Loading..</Text>
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