import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as FontSizes from '../../../helpers/FontSizes';
import PropertyRow from '../../../organisms/PropertyRow';
import * as Colors from '../../../helpers/ColorPallette';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import Icon from 'react-native-vector-icons/FontAwesome';
import InteractionBlocker from '../../shared/InteractionBlocker';
import ErrorScreen from '../../shared/ErrorScreen';
import {
  StyleSheet,
  View,
  FlatList,
  Text
} from 'react-native';

class FavouritesScreen extends Component{

  constructor(props){
    super(props);
    this.state = {
      showErrorScreen: false,
      blockInteractions: false
    }
  }

  _onPress(property){
    this.setState({blockInteractions: true});
    this.props.getPropertyViewings(property.id)
    .then(() => {
      this.setState({blockInteractions: false});
      this.props.goToGuestFavouritesPropertyScreen(property);
      this.props.navigation.navigate('FavouritesStack');
    })
    .catch((e) => {
      console.log(e);
      this.setState({showErrorScreen: true, blockInteractions: false});
    })
  }

  _addToFavourites(userId, propertyId){
    this.setState({blockInteractions: true});
    this.props.addToFavourites(userId, propertyId)
    .then(() => {
      return this.props.getProperties();
    })
    .then(() => {
      this.setState({blockInteractions: false});
    })
    .catch((e) => {
      console.error(e);
      this.setState({blockInteractions: false, showErrorScreen: true});
    });
  }

  _removeFromFavourites(userId, propertyId){
    this.setState({blockInteractions: true});
    this.props.removeFromFavourites(userId, propertyId)
    .then(() => {
      return this.props.getProperties();
    })
    .then(() => {
      this.setState({blockInteractions: false});
    })
    .catch((e) => {
      console.error(e);
      this.setState({blockInteractions: false, showErrorScreen: true});
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
    if(this.props.properties.length == 0){
      return(
        <View style={styles.noFavouritesContainer}>
          <Text style={styles.noFavouritesMessage}>Shortlist the best properties by adding them to your favourites.</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
          <View style={{height: 25, backgroundColor: Colors.DARK_BLUE}}></View>
          <FlatList
            data={this.props.properties}
            renderItem={(property) => this._renderRow(property)}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={false}
          />
          {
            !this.state.blockInteractions ? null :
            <InteractionBlocker />
          }
          {
            !this.state.showErrorScreen ? null :
            <ErrorScreen close={() => {this.setState({showErrorScreen: false})}} />
          }
          <NetworkErrorMessage isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
      </View>
    )
  }
  
}

FavouritesScreen.navigationOptions = {
  title: 'Favourites',
  tabBarLabel: 'Favourites',
  tabBarIcon: ({ tintColor }) => (
      <Icon name="heart"  size={24} color={tintColor} style={{height: 24, width: 24}}/>
  )
};

const mapStateToProps = (state) => {
    let properties = state.properties.listings
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
  },
  noFavouritesContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingRight: 40,
    paddingLeft: 40
  },
  noFavouritesMessage: {
    color: Colors.LIGHT_GRAY,
    alignSelf: 'center',
    fontSize: FontSizes.DEFAULT,
    textAlign: 'center'
  }
});