import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as FontSizes from '../../../helpers/FontSizes';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ListViewDataSource,
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
    fontSize: FontSizes.DEFAULT,
    textAlign: 'center',
    margin: 10,
  },
});

class ViewingsScreen extends Component{

  
  render() {
    return (
      <View style={styles.container}>
         
          <Text style={styles.welcome}>
            Viewings Screen
          </Text>
            
      </View>

    )
  }
  
}

ViewingsScreen.navigationOptions = {
  title: 'Viewings Screen',
};


const mapStateToProps = (state) => {
   return {}
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingsScreen);
