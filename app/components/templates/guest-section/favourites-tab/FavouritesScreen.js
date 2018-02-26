import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropertyRow from '../../../organisms/PropertyRow';
import * as Colors from '../../../helpers/ColorPallette';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';

import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';

class FavouritesScreen extends Component{

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

 _renderRow = function({item}){
    let property = item;
    return (
            <PropertyRow
              property= {property}
              user = {this.props.user.info}
              onPress = { (property) => { this._onPress(property) }}
              enableFavourites={true}
              onAddToFavourites = { (userId, propertyId) => { this._addToFavourites(userId, propertyId) }}
              onRemoveFromFavourites = { (userId, propertyId) => { this._removeFromFavourites(userId, propertyId) }} 
            />
        )
  }

  render() {
    return (
      <View style={styles.container}>
          <FlatList
            data={this.props.properties}
            renderItem={(property) => this._renderRow(property)}
            keyExtractor={(item, index) => index}
            removeClippedSubviews={false}
          />
          <NetworkErrorMessage isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
      </View>

    )
  }
  
}

FavouritesScreen.navigationOptions = {
  title: 'Favourites',
};

const mapStateToProps = (state) => {
    let properties = state.properties.propertiesList
    .filter(function(property){
      return property.isFavourite;
    });

    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        properties: properties,
        network: state.network
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavouritesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});