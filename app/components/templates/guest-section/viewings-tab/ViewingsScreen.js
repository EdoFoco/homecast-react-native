import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
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
});

class ViewingsScreen extends Component{

  _onPress(){
      //this.props.goToScreen('Viewings');
      this.props.navigation.navigate('Other');
  }

  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.welcome}>
            Viewings Screen
          </Text>
            <TouchableHighlight style={styles.button} onPress={this._onPress.bind(this)} underlayColor='#99d9f4'>
                  <Text style={styles.buttonText}>Go To Other</Text>
              </TouchableHighlight>
      </View>

    )
  }
  
}

ViewingsScreen.navigationOptions = {
  title: 'Viewings Screen',
};


const mapStateToProps = (state) => {
   console.log('ViewingsScreen');
    console.log(state);
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingsScreen);
