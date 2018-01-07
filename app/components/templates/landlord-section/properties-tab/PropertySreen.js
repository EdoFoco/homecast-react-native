import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropertyRow from '../../../organisms/PropertyRow';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Image
} from 'react-native';

class PropertyScreen extends Component{

  
  render() {
    return (
      <View style={styles.container}>
          <Text>Property Screen</Text>
      </View>
    )
  }
}

PropertyScreen.navigationOptions = ({ navigation }) => {
    return {
      title: 'Property'
  }
};

const mapStateToProps = (state) => {
     
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        properties: state.properties.propertiesList
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
 
});