import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import  GuestTabBar  from '../../navigators/GuestTabBarNavigator';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import { addNavigationHelpers } from 'react-navigation';
import AuthForm from '../molecules/AuthForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

class MainScreen extends Component {

  render(){
    if(this.props.isLoggedIn){
        return(
          <GuestTabBar />
        )
    }
    return(
      <View style={styles.container}>
          <AuthForm />
        </View>
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
        nav: state.nav
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);

