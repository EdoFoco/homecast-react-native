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
    
    this.props.getPropertyViewings(this.props.currentProperty.id)
    .then((viewings) => {
      var sorted = viewings.sort(function(a, b) {
        a = new Date(a.date_time);
        b = new Date(b.date_time);
        return a<b ? -1 : a>b ? 1 : 0;
      });

      this.props.updateCurrentPropertyViewings(sorted);
      this.props.updateViewingsLoaded(true);
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  _goToViewing(viewingId){
      //this.props.navigation.navigate('Other', { viewing : viewing });
      return this.props.getViewing(viewingId)
      .then((viewing) => {
          this.props.navigation.navigate('PropertiesTabViewing', { viewing : viewing });
      })
      .catch((error) => {
        console.error(error);
      });
    }
  
  render() {
    return (
        <Property 
            currentProperty={this.props.currentProperty}
            viewings={this.props.currentPropertyViewings}
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
        currentProperty: navigation.navigation.state.params.property,
        currentPropertyViewings: state.currentPropertyViewings,
        propertyScreen: state.propertyScreen,
        properties: state.properties
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyContainer);
