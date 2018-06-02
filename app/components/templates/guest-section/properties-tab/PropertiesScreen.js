import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropertyRow from '../../../organisms/PropertyRow';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import { View, StyleSheet, FlatList, TouchableHighlight, Dimensions, Text, Keyboard, TextInput } from 'react-native';
import FastImage from 'react-native-fast-image';
import Autocomplete from '../../shared/Autocomplete';
import LocationSuggestions from '../../shared/LocationSuggestions';
import FiltersModal from '../../shared/FiltersModal';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

class PropertiesScreen extends Component{

  constructor(props){
    super(props);
    this.state = {
      isSearching: false,
      locationSearchValue: '',
      showFiltersModal: false,
      isRefreshing: false
    }
  }

  componentWillMount(){
    this.props.getProperties();
  }

  _onPress(property){
      this.props.goToGuestPropertyScreen(property);
      this.props.navigation.navigate('PropertyStack', { property : property});
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
    this.props.updateFilters({...this.props.searchFilters, placeId: suggestion.place_id});
    this.props.getProperties(this.props.searchFilters);
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

  _refresh(){
    this.setState({isRefreshing: true});
    this.props.getProperties()
    .then(() => {
      this.setState({isRefreshing: false})
    });
  }

  render() {
    console.log(this.state.isSearching);
    return (
      <View style={styles.container}>
         <View style={this.state.isSearching && this.props.location.suggestions.length > 0 ? styles.menuWrapperActive : styles.menuWrapper}>
          <View style={styles.autocompleteContainer}>
            <FastImage style={styles.logo} source={require('../../../../img/homecast_logo_color_6.png')} resizeMode={FastImage.resizeMode.cover}/>
            <Autocomplete
                textValue={this.state.locationSearchValue}  
                placeholder="Type a location" 
                height={40}
                getLocationSuggestions={(text) => {this.props.getAddressSuggestions(text, 'geocode')}}
                onChange={(text) => {this._handleLocationTextChange(text)}}
                onFocus={() => {this.setState({ isSearching: true })}}
                onEndFocus={() => {this._handleOnEndFocus()}}
                />
            <MCIcon name="filter-variant" style={styles.filterIcon} onPress={() => { this.setState({showFiltersModal: !this.state.showFiltersModal }) }}/>
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
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={false}
          refreshing={this.state.isRefreshing}
          onRefresh={() => this._refresh()}
        />

        {
          !this.state.showFiltersModal ? null :
          <FiltersModal 
            getProperties={(filters) => {this.props.getProperties(filters)}}
            filters={this.props.searchFilters} 
            updateFilters={(filters) => {this.props.updateFilters(filters)}} 
            closeModal={() => {this.setState({showFiltersModal: false})}} />
        }

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
        location: state.location,
        searchFilters: state.filters.searchFilters
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
    paddingTop: 30,
    alignItems: 'center',
    paddingBottom: 10,
    paddingBottom: 30,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
  },
  menuWrapperActive: {
    backgroundColor: 'white',
    paddingTop: 30,
    alignItems: 'center',
    paddingBottom: 10,
    flex: 1,
    paddingBottom: 10,
  },
  menuTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  logo:{
    width: 60,
    height: 60,
    marginRight: 10,
    borderColor: Colors.LIGHT_GRAY,
    marginTop: 7
  },
  title: {
    fontSize: 30,
    color: Colors.AQUA_GREEN,
    paddingTop: 5
  },
  autocompleteContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  locationSuggestionsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    marginRight: 20,
    marginLeft: 20,
  },
  filterIcon: {
    color: Colors.AQUA_GREEN,
    fontSize: 28,
    marginLeft: 20
  }
});