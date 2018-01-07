import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropertyRow from '../../../organisms/PropertyRow';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import AdminViewingScreen from '../../shared/AdminViewingScreen';

import {
  StyleSheet,
  Text,
  View
 } from 'react-native';

class ViewingScreen extends Component{
  
  componentWillMount(){
      this.props.getViewing(this.props.viewing.id);
  }
  
  render() {
    return (
      <AdminViewingScreen 
            viewing={this.props.viewing}
            property={this.props.property}
            user={this.props.user}
       />
    )
  }
}

ViewingScreen.navigationOptions = ({ navigation }) => {
    return {
      title: 'Viewing'
  }
};


const mapStateToProps = (state, {navigation}) => {
     
  let property = state.properties.propertiesList.find(p => p.id === navigation.state.params.property.id);
  return {
      property: property,
      viewing: property.viewings.find(v => v.id === navigation.state.params.viewingId),
      user: state.user
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