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
  View
 } from 'react-native';

class ViewingScreen extends Component{
  
  componentWillMount(){
      this.props.getViewing(this.props.navigation.navigation.state.params.viewing.id);
  }
  
  render() {
    return (
      <View style={styles.container}>
          <Text>This is viewing</Text>
      </View>
    )
  }
}

ViewingScreen.navigationOptions = ({ navigation }) => {
    return {
      title: 'Viewing'
  }
  
};


const mapStateToProps = (state) => {
     
    return {
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});