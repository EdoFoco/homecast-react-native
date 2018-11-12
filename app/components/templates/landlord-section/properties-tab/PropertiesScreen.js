import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AutocompleteControl from '../../shared/AutocompleteControl';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Dimensions
} from 'react-native';

class PropertiesScreen extends Component{

  constructor(props){
    super(props);
    this.state = {
      showAddPropertyModal: false
    }
  }

  componentWillMount(){
    this.props.getUserProperties(this.props.user.info.id);
  }

  _onPress(property){
      this.props.goToLandlordPropertyScreen(property);
      this.props.navigation.navigate('PropertyStack');
  }

  _showAddPropertyModal(){
    this.setState({showAddPropertyModal: !this.state.showAddPropertyModal});
  }

  _createProperty(placeId){
    this.props.createProperty(placeId, this.props.user.info.id)
    .then(()=>{
      this.setState({showAddPropertyModal: !this.state.showAddPropertyModal});
    });
  }

 _renderRow = function({item}){
    let property = item;
    return (
        <TouchableHighlight onPress={() => {this._onPress(property)}}>
          <View style={styles.listingCell}>
            <FastImage style={styles.listingImage} source={{url: property.images.length > 0 ? property.images[0].url : ''}}/>
            <View style={styles.listingDescription}>
              <Text style={styles.listingTitle}>{property.address.replace(', UK', '')}</Text>
              {
                property.listing_active ? 
                <Text style={styles.active}>
                  <Icon name="check-circle" style={styles.activeIcon} />
                     Active
                </Text> :
                <Text style={styles.active}>
                  <Icon name="check-circle" style={styles.inactiveIcon} />
                  Inactive
                </Text> 
              }
            </View>
          </View>
        </TouchableHighlight>
          
        )
  }

  render() {
    return (
      <View style={styles.container}>
          <FlatList
            style={{flex: 0.9}}
            data={this.props.properties}
            renderItem={(property) => this._renderRow(property)}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={false}
          />
            {
              !this.state.showAddPropertyModal ? 
                <TouchableHighlight style={styles.addPropertyButton} onPress={() => {this._showAddPropertyModal()}}>
                    <Text style={styles.addPropertyTxt}>Add Property</Text> 
                </TouchableHighlight> :
                <View>
                  <TouchableHighlight style={styles.formOverlay} onPress={() => {this._showAddPropertyModal()}}><Text></Text></TouchableHighlight>
                  <View style={styles.formContainer} onPress={() => {console.log('do nothing')}}>
                    <AutocompleteControl
                      style={styles.autoCompleteControl}
                      title="Property Address"
                      description=""
                      placeholder="Type an address"
                      updateProperty = {(property) => this._createProperty(property)}
                      getLocationSuggestions={(text, type) => {this.props.getAddressSuggestions(text, type)}}
                      updateLocationSuggestions={(suggestions) => {this.props.updateLocationSuggestions(suggestions)}} 
                      suggestions={this.props.autocompleteSuggestions}
                  />
                  </View>
              </View>
          }
      </View>
    )
  }
}

PropertiesScreen.navigationOptions = ({ navigation }) => {
    return {
      tabBarIcon: ({ tintColor }) => (
        <FontAwesomeIcon name="home" size={24} color={tintColor} style={{height: 24, width: 24}} />
      ),
      headerRight: <TouchableHighlight onPress={() => { navigation.navigate('AddPropertyScreen')}}><Text style={{fontSize: 30, color: Colors.RED, marginRight: 20}}>+</Text></TouchableHighlight>,
  }
  
};


const mapStateToProps = (state) => {
     
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        properties: state.properties.propertiesList,
        autocompleteSuggestions: state.location.suggestions
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10
  },
  addPropertyButton: {
    backgroundColor: Colors.AQUA_GREEN,
    flex: 0.1,
    justifyContent: 'center'
  },
  addPropertyTxt: {
      color: 'white',
      textAlign: 'center',
      fontSize: FontSizes.DEFAULT
  },
  listingCell: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.WHITE_SMOKE,
    paddingTop: 5,
    paddingBottom: 5
  },
  listingDescription: {
    flex: 1,
    margin: 5
  },
  iconsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flex: 1
  },
  descriptionIcon: {
    fontSize: 16,
    marginRight: 10,
    color: Colors.LIGHT_GRAY
  },
  iconText: {
      marginLeft: 5,
      marginRight:10,
      color: Colors.LIGHT_GRAY
  },
  listingImage: {
    height: 100,
    width: 150,
    margin: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  listingTitle: {
    fontSize: FontSizes.DEFAULT
  },
  active: {
    marginTop: 5,
    color: Colors.LIGHT_GRAY,
    fontSize: FontSizes.DEFAULT,
    justifyContent: 'center'
  },
  activeIcon: {
    fontSize: 20,
    color: Colors.AQUA_GREEN
  },
  inactiveIcon: {
    fontSize: 20,
    color: Colors.LIGHT_GRAY
  },
  formOverlay: {
    position: 'absolute',
    alignSelf: 'center',
    height:  Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  formContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    alignSelf: 'center',
    flex: 1,
    height:  400,
    left: 0,
    right: 0,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
});