import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import * as t from 'tcomb-form-native'
import Loader from '../atoms/Loader';
import * as FontSizes from '../helpers/FontSizes';
import * as errorHandler from '../../actions/ErrorHandler';
var _ = require('lodash');

import { 
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  AsyncStorage,
  TextInput,
  Dimensions,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Text } from 'react-native';

var Form = t.form.Form;

var Person = t.struct({
    email: t.String,              
    password: t.String,  
});

const formStylesheet = _.cloneDeep(t.form.Form.stylesheet);
formStylesheet.textbox.normal.color = 'white';

formStylesheet.textbox.normal.borderWidth = 0;
formStylesheet.textbox.error.borderWidth = 0;
formStylesheet.textbox.normal.marginBottom = 0;
formStylesheet.textbox.error.marginBottom = 0;

formStylesheet.textboxView.normal.borderWidth = 0;
formStylesheet.textboxView.error.borderWidth = 0;
formStylesheet.textboxView.normal.borderRadius = 0;
formStylesheet.textboxView.error.borderRadius = 0;
formStylesheet.textboxView.normal.borderBottomWidth = 1;
formStylesheet.textboxView.error.borderBottomWidth = 1;
formStylesheet.textboxView.normal.borderColor = "white";

formStylesheet.textbox.normal.marginBottom = 5;
formStylesheet.textbox.error.marginBottom = 5;
formStylesheet.textbox.normal.borderColor = "white";

var options = {
    auto:'placeholders',
    fields: {
        password: {
            password: true,
            secureTextEntry: true,
            stylesheet: formStylesheet,
            placeholderTextColor: 'white'
        },
        email: {
            stylesheet: formStylesheet,
            placeholderTextColor: 'white'
        }      
    }
}; 



var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20A4F3',
    //justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'stretch'
  },
  loaderContainer: {
      flex: 1,
      backgroundColor: '#20A4F3',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      alignSelf: 'stretch'
  },
  title: {
    fontSize: FontSizes.BIG,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: FontSizes.DEFAULT,
    color: 'white',
    alignSelf: 'center'
  },
  loginBtn: {
    height: 36,
    backgroundColor: '#20A4F3',
    borderColor: '#20A4F3',
    borderWidth: 1,
    //borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  signupBtn: {
    height: 36,
    backgroundColor: '#FF3366',
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 1,
    //borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  formContainer: {
    width: 300,
    padding: 30,
    marginTop: 100
  },
  opaqueLayer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  formTitle: {
      fontSize: FontSizes.BIG,
      alignSelf: 'center',
      marginBottom: 20,
      color: 'white'
  },
  backgroundImage: {
      alignSelf: 'stretch',
      width: null,
      height: null,
      resizeMode:"cover",
      flex: 1,
      alignItems: 'center'
      
  },
  form: {
      color: 'white'
  },
  logo:{
      width: 130,
      resizeMode: 'contain',
      alignSelf: 'center'
  }
});

var WINDOW_HEIGHT = Dimensions.get('window').height;

class AuthForm extends Component{

 componentWillMount(){
    AsyncStorage.getItem('@AuthToken:key')
    .then((token) => {
        if(!token){
           throw new Error("No auth token");
        }

        return this.props.updateAuthToken(token, false);
    })
    .then(() => {
        return this.props.getLoggedInUser();
    })
    .catch((error) => {
        console.warn(error);
        if(typeof error.response !== 'undefined'){
            if(error.response.status == 401){
                this.props.handleUnauthorized();
            }
        }
       //console.error('API Error - handle error');
       this.props.handleUnauthorized();
    });
  }


  _onPress() {
    var credentials = this.refs.form.getValue();
    if (credentials) { // if validation fails, value will be null
      this.props.login(credentials)
        .then((user) => {
            this.props.updateAuthToken(user.token);
            this.props.updateUserInfo(user);
        })
        .catch((error) => {
            this.props.handleUnauthorized();
        });
    }
  }

  render() {
        if (this.props.isAuthenticating) {
            return(  <View style={styles.loaderContainer}><Loader /></View>);
        }
        
        return (
            <View style={styles.container}>
                <Image style={styles.backgroundImage} source={require('../../img/luxury-home-bg.jpg')}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View style={styles.opaqueLayer}>

                        <View style={styles.formContainer}>
                            <Image style={styles.logo} source={require('../../img/logo.png')} />
                            <Form style={styles.form}
                                ref="form"
                                type={Person}
                                options={options}
                            />
                            <TouchableHighlight style={styles.loginBtn} onPress={this._onPress.bind(this)} underlayColor='#99d9f4'>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.signupBtn} onPress={console.log('Sign up')} underlayColor='#99d9f4'>
                                <Text style={styles.buttonText}>Create Account</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    </TouchableWithoutFeedback>
                </Image>
            </View>
        );
     
    
  }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        isLoggedIn: state.user.isLoggedIn,
        isAuthenticating: state.user.isAuthenticating,
        nav: state.nav
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
