import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as FontSizes from '../../../helpers/FontSizes';
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
    fontSize: FontSizes.DEFAULT,
    textAlign: 'center',
    margin: 10,
  },
});

class PropertyScreen extends Component{

  _onPress(){
      this.props.navigation.navigate('Viewings');
  }

  render() {
    return(<View style={styles.container}>
      <Text style={styles.welcome}>
        Property Screen
      </Text>
    </View>)
  }
}


PropertyScreen.navigationOptions = {
  title: 'Property Screen',
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

export default connect(mapStateToProps, mapDispatchToProps)(PropertyScreen);
