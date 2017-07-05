import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';

import { 
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  AsyncStorage,
  TextInput,
  Text } from 'react-native';


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

class WebRTCChat extends Component{
 

  componentWillMount(){
    this.props.message();
  }

  render() {
        
        return (
            <View style={styles.container}>
                 <Text>Login</Text>
            </View>
        );
     
    
  }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WebRTCChat);
