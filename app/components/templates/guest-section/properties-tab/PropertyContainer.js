import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import Property from '../../shared/Property';
import * as Colors from '../../../helpers/ColorPallette';
import {
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';


class PropertyContainer extends Component{

  componentWillMount(){
   
    this.props.updateCurrentProperty(this.props.currentProperty);
    
    this.props.getViewingReservations(this.props.user.info.id)
    .catch((error) => {
      console.error(error);
    })
  }

  _goToViewing(viewingId){
      this.props.navigation.navigate('PropertiesTabViewing', { viewingId: viewingId, property: this.props.currentProperty});
    }
  
  render() {
    return (
        <Property 
            currentProperty={this.props.currentProperty}
            properties={this.props.properties}
            propertyScreen={this.props.propertyScreen}
            goToViewing={(viewingId) => { return this._goToViewing(viewingId)}}
            updatePropertyActiveTab={(index) => { return this.props.updatePropertyActiveTab(index)}}
        />
    )
  }
}

PropertyContainer.navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.property.name}`,
    headerTintColor: Colors.RED,
    headerStyle: {  borderBottomWidth: 0, backgroundColor: 'white', shadowColor: 'white' }
  });
  

const mapStateToProps = (state, navigation) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        currentProperty: state.properties.propertiesList.find(p => p.id === navigation.navigation.state.params.property.id),
        currentPropertyViewings: state.properties.propertiesList.find(p => p.id === navigation.navigation.state.params.property.id).viewings,
        propertyScreen: state.propertyScreen,
        properties: state.properties
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyContainer);
