import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropertyRow from '../../../organisms/PropertyRow';
import * as Colors from '../../../helpers/ColorPallette';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import { View, StyleSheet, FlatList, TouchableHighlight, Dimensions, Text, Keyboard } from 'react-native';
import FastImage from 'react-native-fast-image';
import Autocomplete from '../../shared/Autocomplete';
import LocationSuggestions from '../../shared/LocationSuggestions';

class PropertiesScreen extends Component{

  constructor(props){
    super(props);
    this.state = {
      isSearching: false,
      locationSearchValue: ''
    }
  }

  componentWillMount(){
    this.props.getProperties();
  }

  _onPress(property){
      this.props.navigation.navigate('PropertiesTabPropertyScreen', { property : property});
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
              property = {property}
              user = {this.props.user.info}
              onPress = { (property) => { this._onPress(property) }}
              enableFavourites={true}
              onAddToFavourites = { (userId, propertyId) => { this._addToFavourites(userId, propertyId) }}
              onRemoveFromFavourites = { (userId, propertyId) => { this._removeFromFavourites(userId, propertyId) }} 
            />
    )
  }

  _selectLocation(suggestion){
    this.setState({locationSearchValue: suggestion.description})
    this.props.updateLocationSuggestions([]);
    Keyboard.dismiss();
  }

  _handleLocationTextChange(text){
    this.setState({locationSearchValue: text})
  }

  _handleOnEndFocus(){
    this.setState({ isSearching: false });
    this.props.updateLocationSuggestions([]);
  }

  render() {
    console.log(this.state.isSearching);
    return (
      <View style={styles.container}>
         <View style={this.state.isSearching && this.props.location.suggestions.length > 0 ? styles.menuWrapperActive : styles.menuWrapper}>
          <View style={styles.menuTitleContainer}>
              <FastImage style={styles.logo} source={require('../../../../img/homecast_logo_color_6.png')} resizeMode={FastImage.resizeMode.contain}/>
              <Text style={styles.title}>homecast</Text>
          </View>
          <View style={styles.autocompleteContainer}>
            <Autocomplete
                textValue={this.state.locationSearchValue}  
                style={styles.autoComplete}
                placeholder="Type a location" 
                height={40}
                getLocationSuggestions={(text) => {this.props.getAddressSuggestions(text, 'geocode')}}
                onChange={(text) => {this._handleLocationTextChange(text)}}
                onFocus={() => {this.setState({ isSearching: true })}}
                onEndFocus={() => {this._handleOnEndFocus()}}
                />
          </View>
          <View style={styles.locationSuggestionsContainer}>
            <LocationSuggestions 
                style={styles.locationSuggestions}
                suggestions={this.props.location.suggestions} 
                onPress={(suggestion) => { this._selectLocation(suggestion) }}/>
          </View>
        </View>
       
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

PropertiesScreen.navigationOptions = {
  title: 'Properties',
};

const mapStateToProps = (state) => {
     
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        properties: state.properties.propertiesList,
        network: state.network,
        location: state.location
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  menuWrapper: {
    backgroundColor: 'white',
    paddingTop: 20,
    alignItems: 'center',
    paddingBottom: 10,
    height: 130,
    paddingBottom: 10
  },
  menuWrapperActive: {
    backgroundColor: 'white',
    paddingTop: 20,
    alignItems: 'center',
    paddingBottom: 10,
    flex: 1,
    paddingBottom: 10
  },
  menuTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  logo:{
    width: 50,
    height: 50,
    marginRight: 10
  },
  title: {
    fontSize: 30,
    color: Colors.AQUA_GREEN,
    paddingTop: 5
  },
  autocompleteContainer: {
    alignSelf: 'stretch',
    marginRight: 30,
    marginLeft: 30,
    height: 40
  },
  locationSuggestionsContainer: {
    flex: 0.8,
    alignSelf: 'stretch',
    marginRight: 30,
    marginLeft: 30
  }
});