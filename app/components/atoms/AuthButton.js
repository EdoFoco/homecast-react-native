import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';

class AuthButton extends Component{
   _login(){
     this.props.loginUser().then(function(){
         //Do something
      });
   }

  render() {
    return <Button
      title={this.props.isLoggedIn ? 'Log Out' : 'Log In'}
       onPress={ () => this.props.isLoggedIn ? this.props.actionLogout : this._login() }
    />
  }
}

AuthButton.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  //logout: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    isLoggedIn: state.user.isLoggedIn,
  }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthButton);
