import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';


import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
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


 class HomeScreen extends Component{

  _onPress(){
      //this.props.goToScreen('Viewings');
      this.props.navigation.navigate('Property');
  }

  render() {
    return(<View style={styles.container}>
      <Text style={styles.welcome}>
        Guest Screen
      </Text>
      <TouchableHighlight style={styles.button} onPress={this._onPress.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Go To Property</Text>
        </TouchableHighlight>
    </View>)
  }
}


HomeScreen.navigationOptions = {
  title: 'Guest Screen',
};


const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
