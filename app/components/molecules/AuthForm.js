import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import * as t from 'tcomb-form-native'
import LoginStatusMessage from '../atoms/LoginStatusMessage';
import AuthButton from '../atoms/AuthButton';
import { 
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Text } from 'react-native';

var Form = t.form.Form;

var Person = t.struct({
    username: t.String,              
    password: t.String,  
});

var options = {
    auto:'placeholders',
    fields: {
        password: {
            password: true,
            secureTextEntry: true
        }   
    }
}; 

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 0,
    padding: 0,
    backgroundColor: '#ffffff',
    width:300
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    width: 100
  },
  form: {
      
  }
});

class AuthForm extends Component{

 componentDidMount(){
    // give focus to the name textbox
    this.refs.form.getComponent('username').refs.input.focus();
  }

  _login(credentials){
      console.log(credentials);
     this.props.loginUser(credentials).then(function(){
         //Do something
      });
   }

  _onPress() {
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      this._login(value);
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <Form style={styles.form}
          ref="form"
          type={Person}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this._onPress.bind(this)} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
        <LoginStatusMessage />
      </View>
    )
  }
}

AuthButton.propTypes = {
  loginUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  console.log(state);
  return {};
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

/*const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  login: () => dispatch(NavigationActions.navigate({ routeName: 'Login' })),
});*/

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
