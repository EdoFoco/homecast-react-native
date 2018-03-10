import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropertyRow from '../../../organisms/PropertyRow';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import FastImage from 'react-native-fast-image';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight
} from 'react-native';

class PropertiesScreen extends Component{

  componentWillMount(){
    this.props.getUserProperties(this.props.user.info.id);
  }

  _onPress(property){
      this.props.navigation.navigate('EditPropertyScreen', { property : property});
  }

 _renderRow = function({item}){
    let property = item;
    return (
        <TouchableHighlight onPress={() => {this._onPress(property)}}>
          <View style={styles.listingCell}>
            <View style={styles.listingDescription}>
              <Text style={styles.listingTitle}>{property.name}</Text>
              <View style={styles.iconsContainer}>
                <FontAwesomeIcon name="bed" style={styles.descriptionIcon} /> 
                <Text style={styles.iconText}>{property.bedrooms}</Text>
                <FontAwesomeIcon name="bath" style={styles.descriptionIcon} /> 
                <Text style={styles.iconText}>{property.bathrooms}</Text>
              </View>
            </View>
              <FastImage style={styles.listingImage} source={{url: property.thumbnail}}/>
          </View>
        </TouchableHighlight>
          
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
      </View>
    )
  }
}

PropertiesScreen.navigationOptions = ({ navigation }) => {
    return {
      title: 'Listings',
      headerRight: <TouchableHighlight onPress={() => { navigation.navigate('AddPropertyScreen')}}><Text style={{fontSize: 30, color: Colors.RED, marginRight: 20}}>+</Text></TouchableHighlight>,
  }
  
};


const mapStateToProps = (state) => {
     
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        properties: state.properties.propertiesList
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  addPropertyTxt: {
    color: 'white',
    fontSize: FontSizes.DEFAULT,
    alignSelf: 'center'
  },
  listingCell: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.WHITE_SMOKE
  },
  listingDescription: {
    flex: 0.5
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
    height: 120,
    width: 180,
    alignSelf: 'flex-end',
    right: 0
  },
  listingTitle: {
    fontSize: FontSizes.DEFAULT
  }
});