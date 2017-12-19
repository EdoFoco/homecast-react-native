import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  AsyncStorage
} from 'react-native';

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
    return(
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <TouchableHighlight style={styles.section}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            <FontAwesomeIcon name="user-o" style={styles.sectionIcon} /> 
          </View>
        </TouchableHighlight>
        
        <TouchableHighlight style={styles.section} onPress={this._onPress.bind(this)}>
          <View style={styles.buttonWrapper}>
            
              {
                this.props.section.sectionName == 'guest' ?
                <Text style={styles.sectionTitle}>Admin Section</Text>:
                <Text style={styles.sectionTitle}>Guest Section</Text>
              }
            <FontAwesomeIcon name="refresh" style={styles.sectionIcon} /> 
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.section} onPress={() => { this._logout() }}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.sectionTitle}>Log Out</Text>
            <FontAwesomeIcon name="sign-out" style={styles.sectionIcon} /> 
          </View>
        </TouchableHighlight>
      </View>

    </View>)
  }
}


OptionsScreen.navigationOptions = {
  title: 'Options',
};


const mapStateToProps = (state) => {
    return {
        section: state.section,
        user: state.user
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 0,
  },
  sectionContainer: {
    paddingTop: 60,
  },
  buttonWrapper: {
    flexDirection: 'row'
  },
  section: {
    paddingRight: 40,
    paddingLeft: 50,
    paddingTop: 40,
    paddingBottom: 40
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 22,
    color: Colors.DARK_GREY,
    flex: 0.9
  },
  sectionIcon: {
    color: Colors.AQUA_GREEN,
    alignSelf: 'flex-end',
    flex: 0.1,
    fontSize: 32,
    fontWeight: '100'
  },
  logoutSection: {
    flex: 0.5
  },
  logoutButton: {
    
    alignSelf: 'center',
    backgroundColor: Colors.RED
  }
});