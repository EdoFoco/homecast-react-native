import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  AsyncStorage
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  logoutButton: {
    width: 150,
    height: 40,
    backgroundColor: Colors.PINK
  }
});


 class OptionsScreen extends Component{

  _onPress(){
     if(this.props.section.sectionName === 'guest'){
        this.props.goToSection('landlord');
     }
     else{
         this.props.goToSection('guest');
     }
  }

  _logout(){
    AsyncStorage.removeItem('@AuthToken:key')
    .then(() => {
      this.props.logout();
    });
  }

  render() {
    return(<View style={styles.container}>
      <Text style={styles.welcome}>
        Options Screen
      </Text>
      <TouchableHighlight style={styles.button} onPress={this._onPress.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Change Section</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.logoutButton} onPress={() => { this._logout() }} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Log Out</Text>
        </TouchableHighlight>
    </View>)
  }
}


OptionsScreen.navigationOptions = {
  title: 'Options',
};


const mapStateToProps = (state) => {
    return {
        section: state.section,
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsScreen);
