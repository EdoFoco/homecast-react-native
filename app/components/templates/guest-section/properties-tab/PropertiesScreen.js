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
  View,
  ListView,
  ListViewDataSource,
  TouchableHighlight,
  Image
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

class PropertiesScreen extends Component{

  componentWillMount(){
    this.props.getProperties();
  }

  _onPress(property){
      this.props.navigation.navigate('PropertyScreen', { property : property});
  }

  _addToFavourites(userId, propertyId){
    this.props.addToFavourites(userId, propertyId)
    .then(() => {
      return this.props.getProperties();
    })
    .catch((error) => {
      console.error("Unahndled when adding to favourites");
    });
  }

  _removeFromFavourites(userId, propertyId){
    this.props.removeFromFavourites(userId, propertyId)
    .then(() => {
      return this.props.getProperties();
    })
    .catch((error) => {
      console.error("Unahndled when removing from favourites");
    });
  }

 _renderRow = function(property){
    return (
            <PropertyRow 
              property= {property}
              user = {this.props.user.info}
              onPress = { (property) => { this._onPress(property) }}
              onAddToFavourites = { (userId, propertyId) => { this._addToFavourites(userId, propertyId) }}
              onRemoveFromFavourites = { (userId, propertyId) => { this._removeFromFavourites(userId, propertyId) }} 
            />
        )
  }

  render() {
    return (
      <View style={styles.container}>
         <ListView
            dataSource={this.props.properties}
            enableEmptySections={true}
            renderRow={(rowData, rowId) => this._renderRow(rowData, rowId)} 
          />
      </View>

    )
  }
  
}

PropertiesScreen.navigationOptions = {
  title: 'Properties',
};

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

const mapStateToProps = (state) => {
   console.log('PropertiesScreen');
    console.log(state);

    var rowIds = state.properties.propertiesList.map((row, index) => index);
    
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        properties: ds.cloneWithRows(state.properties.propertiesList, rowIds),
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesScreen);
