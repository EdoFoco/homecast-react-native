import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import MapView from 'react-native-maps';
import DateCell from './DateCell';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import { DEFAULT } from '../../helpers/FontSizes';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  propertyDescriptionWrapper: {
    alignSelf: 'stretch',
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: 'center'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    height: 250
  },
  tabContainer:{
      flex: 1,
      alignSelf: 'stretch',
      alignContent: 'flex-start',
      //flexDirection: 'row',
      //padding: 10,
      //paddingTop: 0
  },
  viewingsTabContainer:{
    flex: 1,
    alignSelf: 'stretch',
    alignContent: 'flex-start',
  },
  viewingsList: {
    //  height: 80
    backgroundColor: 'blue',
    flex: 1
  },
  liveViewingsTitle: {
      backgroundColor: "rgba(246,67,74,1)", 
      alignSelf: 'stretch', 
      color:'white',
      fontSize: FontSizes.DEFAULT,
      padding: 10, 
      justifyContent: 'center'
    },
    viewingRow:{
      flex: 1,
      alignSelf: 'stretch',
      paddingBottom: 10,
      paddingTop: 10,
      borderBottomColor: Colors.LIGHT_GRAY,
      //borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    viewingDateCell: {
      width: 80,
      alignSelf: 'flex-start',
    },
    viewingCapacity: {
      color: Colors.RED,
      fontSize: FontSizes.SMALL_TEXT,
      textAlign: 'right',
      flex: 1
    },
    viewingTime:{
      flex: 0.7,
      fontSize: FontSizes.DEFAULT,
      textAlign: 'right',
      color: Colors.DARK_GREY,
      paddingRight: 5
    },
    menuContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      alignItems: 'flex-end',
    },
    menuItemContainer: {
      alignSelf: 'flex-end',
      padding: 20,
      marginRight: 4
    },
    menuItem: {
      alignItems: 'center',
    },
    menuIcon: {
      color: 'white',
      fontSize: FontSizes.TITLE,
      marginBottom: 5
    },
    menuIconActive: {
      color: Colors.AQUA_GREEN,
      fontSize: FontSizes.TITLE,
      marginBottom: 5
    },
    menuText: {
      color: Colors.AQUA_GREEN,
      fontSize: FontSizes.DEFAULT,
      flex: 0.7,
      alignSelf: 'center',
      marginLeft: 10
    },
    menuTextActive: {
      color: Colors.RED,
      fontSize: FontSizes.SMALL_TEXT
    },
    viewingMonthHeader: {
      borderBottomWidth: 2,
      flex: 1,
      fontSize: FontSizes.SMALL_TEXT
    },
    viewingsListContainer: {
      flex: 1,
      backgroundColor: 'green',
      margin: 20,
      height: 80,
      width: 20
    },
    viewingWrapper: {
      height: 60,
      backgroundColor: 'yellow',
      margin: 10,
      alignSelf: 'stretch',
      flex: 1
    },
    viewingButton: {
      flex: 1,
      backgroundColor: 'orange',
      height: 40,
      width: 40
    },
    priceBadge:{
      //backgroundColor: Colors.AQUA_GREEN,
      //bottom: 0,
      color: Colors.AQUA_GREEN,
      //position: 'absolute',
      fontSize: FontSizes.DEFAULT,
      fontWeight: 'bold',
      alignSelf: 'center',
      //lineHeight: 35,
      //paddingLeft: 10,
      //paddingRight: 10,
      //paddingTop: 10,
      //paddingRight: 20
      //width: 150
    },
    propertyTitle: {
      fontSize: FontSizes.BIG,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      color: Colors.DARK_GREY,
      padding: 10,
      paddingTop: 0,
      flex: 0.7
    },
    servicesContainer: {
      flexDirection: 'row',
      alignSelf: 'stretch',
      marginTop: 15,
      
     /* borderTopWidth: 1,
      borderTopColor: Colors.DARK_GREY,
      borderBottomWidth: 1,
      borderBottomColor: Colors.DARK_GREY
      paddingTop: 10,
      paddingBottom: 10*/
    },
    serviceItem: {
      flex: 1,
      alignSelf: 'flex-start',
      alignItems: 'center'
    },
    serviceIcon: {
      fontSize: FontSizes.DEFAULT,
      color: Colors.LIGHT_GRAY
    },
    serviceText: {
      fontSize: FontSizes.SMALL_TEXT,
      color: Colors.DARK_GREY
    },
    descriptionContainer: {
      marginTop: 0,
      padding: 10
    },
    subTitle: {
      fontSize: FontSizes.DEFAULT,
      fontWeight: 'bold',
      color: Colors.DARK_GREY,
      marginTop: 15
    },
    propertyDescription: {
      marginTop: 10,
      fontSize: FontSizes.DEFAULT,
      color: Colors.DARK_GREY
    }
});

export default class Property extends Component{

  _keyExtractor = (item, index) => index;
  
  _renderItem = ({item}) => {
    let viewing = item;
    return (
      <TouchableHighlight onPress={() => {this.props.goToViewing(viewing.id)}}>
        <View style={styles.viewingRow}>
          <View style={styles.viewingDateCell} >
            <DateCell dateTime={viewing.date_time} />
          </View>
          <Text style={styles.viewingCapacity}>Only {viewing.capacity} spots left</Text>
          <Text style={styles.viewingTime}>{new Date(`${viewing.date_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit',  hour12: true}).toUpperCase()}</Text>
        </View>
      </TouchableHighlight>
    )
  };

  _renderInfoTab(){
    return (
      <View style={styles.tabContainer}>
        <View style={{flexDirection: 'row', marginBottom: 20}} >
            <Image source={{uri: this.props.currentProperty.thumbnail}} style={styles.backgroundImage} >
            </Image>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={styles.propertyTitle}>{this.props.currentProperty.name}</Text>
          <View style={{alignItems: 'center', paddingRight: 20}}>
            <Text style={styles.priceBadge}>£ {Math.round(this.props.currentProperty.price)}</Text>
            <Text style={{color: Colors.AQUA_GREEN, fontSize: FontSizes.DEFAULT, alignSelf: 'center'}}>month</Text>
          </View>
         </View>
       <View style={styles.servicesContainer}>
                <View style={styles.serviceItem}>
                    <FontAwesomeIcon name="bed" style={styles.serviceIcon} />
                    <Text style={styles.serviceText}>{this.props.currentProperty.bedrooms} beds</Text> 
                </View>
                <View style={styles.serviceItem}>
                  <MaterialIcons name="sofa" style={styles.serviceIcon}/>
                  <Text style={styles.serviceText}>{this.props.currentProperty.living_rooms} rooms</Text> 
              </View>
              <View style={styles.serviceItem}>
                <FontAwesomeIcon name="bath" style={styles.serviceIcon} />
                <Text style={styles.serviceText}>{this.props.currentProperty.bathrooms} bath</Text> 
              </View>
         </View>
         <View style={styles.descriptionContainer}>
             { 
              this.props.currentProperty.description_sections.map((section, index) => {
                 return ( 
                    <View key={index}>
                       <Text style={styles.subTitle}>{section.title}</Text>
                        <Text style={styles.propertyDescription}>{section.description}</Text>
                    </View>
                  )
              })
             }
           
         </View>
      </View>
    )
  }
  
  _renderMapTab(){
    return (
      <View style={styles.tabContainer}>
         <MapView
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      </View>
    )
  }

  _renderViewingsTab(){
    return (
      <View style={styles.viewingsTabContainer}>
      { 
        !this.props.properties.viewingsLoaded ? null :
          <FlatList style={{margin:5}}
           data={this.props.properties.currentPropertyViewings}
           keyExtractor={this._keyExtractor}
           renderItem={this._renderItem} 
           extraData={this.props.properties}
         />
      }
    </View>
    )
  }
  
  render() {
    return (
      <ScrollView style={{backgroundColor: 'white'}}>
          <View style={styles.container}>
            <View style={{flexDirection: 'row',flex: 1, backgroundColor: Colors.DARK_BLUE, width: Dimensions.get('window').width}}>
              {this.props.propertyScreen.activeTab == 1 ? <Text style={styles.menuText}>Info</Text> : null }
              {this.props.propertyScreen.activeTab == 2 ?<Text style={styles.menuText}>Map</Text> : null }
              {this.props.propertyScreen.activeTab == 3 ?<Text style={styles.menuText}>Live Viewings</Text> : null }
              <View style={styles.menuContainer}>
                      <TouchableHighlight style={styles.menuItemContainer} onPress={ () => { this.props.updatePropertyActiveTab(1)}}>
                        <View style={styles.menuItem}>
                            <FontAwesomeIcon style={this.props.propertyScreen.activeTab == 1 ? styles.menuIconActive : styles.menuIcon} name="info" />
                            { this.props.propertyScreen.activeTab == 1 ? <View style={styles.triangle} /> : null }
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight style={styles.menuItemContainer} onPress={ () => { this.props.updatePropertyActiveTab(2)}}>
                        <View style={styles.menuItem}> 
                            <FontAwesomeIcon style={this.props.propertyScreen.activeTab == 2 ? styles.menuIconActive : styles.menuIcon} name="map" />
                            { this.props.propertyScreen.activeTab == 2 ? <View style={styles.triangle} /> : null }
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight style={styles.menuItemContainer} onPress={ () => { this.props.updatePropertyActiveTab(3)}}>
                        <View style={styles.menuItem}> 
                            <FontAwesomeIcon style={this.props.propertyScreen.activeTab == 3 ? styles.menuIconActive : styles.menuIcon} name="video-camera" />
                            { this.props.propertyScreen.activeTab == 3 ? <View style={styles.triangle} /> : null }
                        </View>
                      </TouchableHighlight>
                </View>
            </View>
            {{
              1: (
                this._renderInfoTab()
              ),
              2: (
                this._renderMapTab()
              ),
              3: (
                this._renderViewingsTab()
              )
            }[this.props.propertyScreen.activeTab]}

          </View>
      </ScrollView>
    )
  }
  
}

Property.PropTypes = {
    currentProperty: PropTypes.object.isRequired,
    viewings: PropTypes.array.isRequired,
    propertyScreen: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    updatePropertyActiveTab: PropTypes.func.isRequired,
    goToViewing: PropTypes.func.isRequired
}
