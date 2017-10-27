import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropertyRow from '../../../organisms/PropertyRow';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as Colors from '../../../helpers/ColorPallette';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Image
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  addPropertyBtn: {
    backgroundColor: Colors.RED,
    //alignSelf: 'stretch',
    height: 40,
    width: 350,
    justifyContent: 'center',
    margin: 10
  },
  addPropertyTxt: {
    color: 'white',
    fontSize: 16,
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
    fontSize: 20
  }
});

class PropertiesScreen extends Component{

  componentWillMount(){
    this.props.getUserProperties(this.props.user.info.id);
  }

  _onPress(property){
      this.props.navigation.navigate('EditPropertyScreen', { property : property});
  }

  _addProperty(){
    this.props.navigation.navigate('AddPropertyScreen');
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
              <Image style={styles.listingImage} source={{url: property.thumbnail}}/>
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
          <TouchableHighlight style={styles.addPropertyBtn} onPress={() => { this._addProperty()}}>
            <Text style={styles.addPropertyTxt}>Add a listing</Text>
          </TouchableHighlight>
      </View>
    )
  }
  
}

PropertiesScreen.navigationOptions = {
  title: 'Listings'
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
