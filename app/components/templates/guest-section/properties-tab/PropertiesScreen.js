import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import PropertyRow from '../../../organisms/PropertyRow';
import * as Colors from '../../../helpers/ColorPallette';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import { View, StyleSheet, FlatList, Keyboard } from 'react-native';
import FastImage from 'react-native-fast-image';
import Autocomplete from '../../shared/Autocomplete';
import LocationSuggestions from '../../shared/LocationSuggestions';
import FiltersModal from '../../shared/FiltersModal';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import GAClient from '../../../../libs/third-party/GoogleAnalytics/ga';
import InteractionBlocker from '../../shared/InteractionBlocker';
import ErrorScreen from '../../shared/ErrorScreen';

class PropertiesScreen extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      isSearching: false,
      locationSearchValue: '',
      showFiltersModal: false,
      isRefreshing: false,
      isLoading: false,
      hasError: false,
      errorMessage: null
    }
  }

  _onPress(property){
      this.setState({isLoading: true});
      this.props.getPropertyViewings(property.id)
      .then(() => {
        this.setState({isLoading: false});
        this.props.goToGuestPropertyScreen(property);
        this.props.navigation.navigate('PropertyStack');
      })
      .catch((e) => {
        console.log(e);
        this.setState({isLoading: false, hasError: true, errorMessage: e.message});
      });
  }

  _addToFavourites(userId, propertyId){
    this.setState({isLoading: true});
    this.props.addToFavourites(userId, propertyId)
    .then(() => {
      return this.props.getProperties();
    })
    .then(() => {
      this.setState({isLoading: false});
    })
    .catch(() => {
      this.setState({isLoading: false});
      this.setState({hasError: true});
    });
  }

  _removeFromFavourites(userId, propertyId){
    this.setState({isLoading: true});
    this.props.removeFromFavourites(userId, propertyId)
    .then(() => {
      return this.props.getProperties();
    })
    .then(() => {
      this.setState({isLoading: false});
    })
    .catch(() => {
      this.setState({isLoading: false});
      this.setState({hasError: true});    
    });
  }

 _renderRow({item}){
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
    this.setState({locationSearchValue: suggestion.description});
    this.props.updateFilters({...this.props.searchFilters, placeId: suggestion.place_id});
    this.props.getProperties(this.props.searchFilters);
    this.props.updateLocationSuggestions([]);
    GAClient.gaClientInstance.trackLocationFilter(suggestion.description);
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
    })
    .catch((e) => {
      console.log(e);
    });
  }

  _loadMoreProperties(){
    console.log('Properties: ', this.props.properties);
    if(this.props.properties.current_page == this.props.properties.last_page){
      return;
    }

    this.props.getProperties(null, this.props.properties.current_page + 1)
    .catch((e) => {
      this.setState({hasError: true}); 
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 25, backgroundColor: Colors.DARK_BLUE}}></View>
         <View style={this.state.isSearching && this.props.location.suggestions.length > 0 ? styles.menuWrapperActive : styles.menuWrapper}>
          <View style={styles.autocompleteContainer}>
            <FastImage style={styles.logo} source={require('../../../../img/homecast_logo_color_6.png')} resizeMode={FastImage.resizeMode.cover}/>
            <Autocomplete
                textValue={this.state.locationSearchValue}  
                style={{marginTop: 30}}
                placeholder="Type a location" 
                height={40}
                getLocationSuggestions={(text) => {this.props.getAddressSuggestions(text, 'geocode')}}
                onChange={(text) => {this._handleLocationTextChange(text)}}
                onFocus={() => {this.setState({ isSearching: true })}}
                onEndFocus={() => {this._handleOnEndFocus()}}
                />
            <MCIcon name="filter-variant" style={styles.filterIcon} onPress={() => { this.setState({showFiltersModal: !this.state.showFiltersModal }) }}/>
          </View>
          <View style={this.state.isSearching && this.props.location.suggestions.length > 0 ? styles.locationSuggestionsContainer : { marginTop: 0, flex: 1}}>
            <LocationSuggestions 
                style={styles.locationSuggestions}
                suggestions={this.props.location.suggestions} 
                onPress={(suggestion) => { this._selectLocation(suggestion) }}/>
          </View>
        </View>
       
        <FlatList
          data={this.props.properties.listings}
          renderItem={(property) => this._renderRow(property)}
          keyExtractor={(item, index) => Math.random().toString(36).substring(7)}
          removeClippedSubviews={false}
          refreshing={this.state.isRefreshing}
          onRefresh={() => this._refresh()}
          onEndReached={() => { this._loadMoreProperties()}}
          onEndReachedThreshold={0.3}
        />

        {
          !this.state.showFiltersModal ? null :
          <FiltersModal 
            getProperties={(filters) => {this.props.getProperties(filters)}}
            filters={this.props.searchFilters} 
            updateFilters={(filters) => {this.props.updateFilters(filters)}} 
            closeModal={() => {this.setState({showFiltersModal: false})}} />
        }

        {
          !this.state.isLoading ? null :
          <InteractionBlocker />
        }
        {
          !this.state.hasError ? null :
          <ErrorScreen close={() => { this.setState({hasError: false, errorMessage: null})}} errorMessage={this.state.errorMessage} />
        }
        {/* <NetworkErrorMessage isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} /> */}
      </View>
    )
  }
  
}

PropertiesScreen.navigationOptions = {
  tabBarIcon: ({ tintColor }) => (
      <Icon name="home" size={24} color={tintColor} style={{height: 24, width: 24}} />
    )
};

const mapStateToProps = (state) => {
    console.log('State ', state);
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        properties: state.properties,
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
    backgroundColor: Colors.DARK_BLUE,
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderColor: Colors.LIGHT_GRAY,
    paddingTop: 10
  },
  menuWrapperActive: {
    backgroundColor: Colors.DARK_BLUE,
    alignItems: 'center',
    flex: 1,
    paddingTop: 10
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
    backgroundColor: 'white',
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 20
  },
  filterIcon: {
    color: Colors.AQUA_GREEN,
    fontSize: 28,
    marginLeft: 20
  }
});