import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropertyRow from '../../../organisms/PropertyRow';
import * as Colors from '../../../helpers/ColorPallette';
import {
  StyleSheet,
  Text,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

class AddPropertyScreen extends Component{

  render() {
    return (
      <Text>Add Property</Text>
    )
  }
  
}

AddPropertyScreen.navigationOptions = {
  title: 'Add Property',
};

const mapStateToProps = (state) => {
     
    return {
        user: state.user
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPropertyScreen);
