import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import * as FontSizes from '../helpers/FontSizes';
import * as Colors from '../helpers/ColorPallette';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import firebase from 'react-native-firebase';
import GAClient from '../../libs/third-party/GoogleAnalytics/ga';

import { 
  View,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Text } from 'react-native';


class AuthForm extends Component{

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            signupName: '',
            signupEmail: '',
            signupPassword: '',
            showLogin: true
        }
    }

  async _login() {
    var credentials = {
        email: this.state.email,
        password: this.state.password
    }
    console.log(credentials);
    if (credentials) { // if validation fails, value will be null
        try{
            var user = await this.props.login(credentials);
            if(!user){
                throw new Error();
            }
            GAClient.gaClientInstance.trackLogin(user.user.id);

            await this.props.updateAuthToken(user.token);
            await this.props.getProperties();
            
            var hasPermission = await firebase.messaging().hasPermission();
            if(!hasPermission){
                await firebase.messaging().requestPermission();
            }

            var token = await firebase.messaging().getToken();
            await this.props.updateDeviceToken(user.user.id, token)
        }
        catch(e){
            this.props.handleUnauthorized();
        }
    }
  }

  async _signup() {
    var info = {
        name: this.state.signupName,
        email: this.state.signupEmail,
        password: this.state.signupPassword,
    }

    try{
        await this.props.signup(info);
        var user = await this.props.login({ email: info.email, password: info.password });
        if(!user){
            throw new Error();
        }
    
        GAClient.gaClientInstance.trackSignup();
        
        await this.props.updateAuthToken(user.token);
        await this.props.getProperties();
    }
    catch(e){
        console.log(e);
        this.props.handleUnauthorized();
    }
  }

  _showLoginScreen(){
      return(
            <View style={styles.formContainer}>
                <View style={styles.textInputWrapper}>
                    <MCIcon name="email-outline" style={styles.textInputIcon} />
                    <TextInput style={styles.textInput} 
                        placeholderTextColor={'rgba(255, 255, 255, 0.8)'} 
                        placeholder="Email"
                        onChangeText={(text) => this.setState({email: text})}></TextInput>
                </View>
                <View style={styles.textInputWrapper}>
                    <MCIcon name="lock-outline" style={styles.textInputIcon} />
                    <TextInput style={styles.textInput}
                        secureTextEntry={true} 
                        placeholderTextColor={'rgba(255, 255, 255, 0.8)'}  
                        placeholder="Password"
                        onChangeText={(text) => this.setState({password: text})}></TextInput>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight style={styles.loginButton} onPress={async () => { await this._login()}}>
                        <View>
                            <Text style={styles.buttonText}>LOG IN</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.signupWrapper} onPress={() => this.setState({showLogin: false})}>
                        <Text style={styles.signupText}>Don't have an account?</Text>
                    </TouchableHighlight>
                </View>
            </View>
      )
  }

  _showSignupScreen(){
    return(
            <View style={styles.formContainer}>
                <View style={styles.textInputWrapper}>
                    <MCIcon name="account-outline" style={styles.textInputIcon} />
                    <TextInput style={styles.textInput} 
                        placeholderTextColor={'rgba(255, 255, 255, 0.8)'} 
                        placeholder="Name"
                        onChangeText={(text) => this.setState({signupName: text})}></TextInput>
                </View>
                <View style={styles.textInputWrapper}>
                    <MCIcon name="email-outline" style={styles.textInputIcon} />
                    <TextInput 
                        style={styles.textInput} 
                        secureTextEntry={false} 
                        placeholderTextColor={'rgba(255, 255, 255, 0.8)'} 
                        placeholder="Email"
                        onChangeText={(text) => this.setState({signupEmail: text})}></TextInput>
                </View>
                <View style={styles.textInputWrapper}>
                    <MCIcon name="lock-outline" style={styles.textInputIcon} />
                    <TextInput style={styles.textInput}
                        secureTextEntry={true} 
                        placeholderTextColor={'rgba(255, 255, 255, 0.8)'}  
                        placeholder="Password"
                        onChangeText={(text) => this.setState({signupPassword: text})}></TextInput>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight style={styles.signupButton} onPress={async () => {await this._signup()}}>
                            <View>
                                <Text style={styles.buttonText}>SIGN UP</Text>
                            </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.loginWrapper} onPress={() => this.setState({showLogin: true})}>
                        <Text style={styles.signupText}>Already have an account?</Text>
                    </TouchableHighlight>
                </View>
            </View>
      )
  }

  render() {
        
        return (
            <View style={styles.container}>
                <FastImage style={styles.backgroundImage} source={require('../../img/ScreenBackground.png')} resizeMode={FastImage.resizeMode.cover} />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.wrapper}>
                    <View style={styles.logoContainer}>
                        <FastImage style={styles.logo} source={require('../../img/homecast_logo_color_6.png')} resizeMode={FastImage.resizeMode.contain}/>
                        <Text style={styles.logoTitle}>homecast</Text>
                    </View>
                    {
                        this.state.showLogin ? this._showLoginScreen() : this._showSignupScreen()
                    }
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
     
    
  }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user.info,
        isAuthenticating: state.user.isAuthenticating,
        nav: state.nav,
        network: state.network
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);



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
    backgroundImage: {
        alignSelf: 'stretch',
        width: null,
        height: null,
        flex: 1,
        alignItems: 'center'
        
    },
    
    wrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60
    },
    logo:{
        width: 80,
        height: 80
    },
    logoTitle: {
        fontSize: FontSizes.BIG,
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    formContainer: {
        width: 300,
        marginTop: 0,
        flex: 1
    },
    textInputWrapper:{
        borderBottomColor: 'rgba(255, 255, 255, 0.6)',
        borderBottomWidth: 2,
        marginTop: 30,
    },
    textInputIcon:{
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 24,
        width: 30,
        position: 'absolute',
        paddingTop: 5,
        paddingLeft: 2
    },
    textInput: {
        height: 40,
        color: 'white',
        fontSize: FontSizes.DEFAULT,
        marginLeft: 40
    },
    loginButton: {
        backgroundColor: Colors.AQUA_GREEN,
        borderRadius: 10,
        borderTopRightRadius: 10,
        paddingTop:15,
        paddingBottom:15,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        width: 300
    },
    signupButton: {
        backgroundColor: Colors.AQUA_GREEN,
        borderRadius: 10,
        borderTopRightRadius: 10,
        paddingTop:15,
        paddingBottom:15,
        marginBottom: 15
    },
    buttonText: {
        color: 'white',
        fontSize: FontSizes.DEFAULT,
        alignSelf: 'center',
        fontWeight: "bold"
    },
    signupWrapper: {
        marginTop: 15
    },
    signupText: {
        color: 'white',
        alignSelf: 'stretch',
        fontSize: FontSizes.DEFAULT
    }
  });
  