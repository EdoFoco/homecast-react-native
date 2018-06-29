import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../actions';
import { bindActionCreators } from 'redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import DateCell from './DateCell';
import PropTypes from 'prop-types';
import ViewingRow from './ViewingRow';
import FastImage from 'react-native-fast-image';
import MapView, { Marker } from 'react-native-maps';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  RefreshControl
} from 'react-native';
import { DEFAULT } from '../../helpers/FontSizes';
import HorizontalViewingsList from './HorizontalViewingsList';

export default class Property extends Component{

  constructor(props) {
    super(props);

    this.state = {
        activeTab: 1,
        isRefreshing: false
    }
   }
   
  _keyExtractor = (item, index) => index.toString();
  
  _toDateString(date){
    let weekday = new Date(`${date}`).toLocaleString('en-us', {  weekday: 'short' });
    let day = new Date(`${date}`).getDate();
    let month = new Date(`${date}`).toLocaleString('en-us', {  month: 'short' });
    let year = new Date(`${date}`).toLocaleString('en-us', {  year: 'numeric' });

    return `${weekday}, ${day} ${month} ${year}`;
  }

  _renderItem = ({item}) => {
    let viewing = item;
    return (
      <ViewingRow viewing={viewing} goToViewing={(viewingId) => {this.props.goToViewing(viewingId, this.props.currentProperty)}} />
    )
  };

  _renderImage = ({item}) => {
    let image = item;
    if(image){
      return(  
        <View style={{ width:  Dimensions.get('window').width }}>
          <FastImage
              style={styles.backgroundImage}
              source={{
                  uri: image.url,
                  priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      )   
    }
    return null;
  }

  _renderViewingItem({item}){
    let viewing = item;
    return (
      <ViewingRow viewing={viewing} goToViewing={() => {this.props.goToViewing(viewing.id, this.props.currentProperty)}}/>
    )
  }

  _renderInfoTab(){
    return (
      <ScrollView style={styles.tabContainer} refreshControl={<RefreshControl
          refreshing={this.state.isRefreshing}
          onRefresh={() => {this._refresh()}}
        />} >
        <View style={{flexDirection: 'row', marginBottom: 20}} >
             <FlatList
                  style={styles.imagesContainer}
                  data={this.props.currentProperty.images}
                  renderItem={(image) => this._renderImage(image)}
                  keyExtractor={(item, index) => index.toString()}
                  removeClippedSubviews={false}
                  horizontal
                  pagingEnabled
              />
            {/* <FastImage source={{uri: this.props.currentProperty.thumbnail}} resizeMode={FastImage.resizeMode.cover} style={styles.backgroundImage} /> */}
        </View>
        <View style={{ flex: 1}}>
          <View style={styles.titleContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.propertyTitle}>£ {Math.round(this.props.currentProperty.price)}</Text>
              <Text style={styles.priceUnit}>/month</Text>
            </View>
            <Text style={styles.address}>{this.props.currentProperty.address}</Text>
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
        </View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Live Viewings</Text>
        </View>
        <View style={{marginBottom: 20, marginTop: 10, paddingBottom: 20, flex:1}}>
        {
          this.props.currentProperty.viewings.length == 0 ?
          <Text style={styles.noViewingsText}>There are no viewings scheduled for this property. Contact the agent to ask for availability.</Text> :
          <FlatList
              style={styles.horizontalViewingContainer}
              data={this.props.currentProperty.viewings}
              renderItem={(viewing) => this._renderViewingItem(viewing)}
              keyExtractor={(item, index) => index.toString()}
              removeClippedSubviews={false}
              pagingEnabled
          />
        } 
        </View>
        <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
          </View>    
         <View style={styles.descriptionContainer}>
            { 
              this.props.currentProperty.description_sections.map((section, index) => {
                 return ( 
                    <View key={index}>
                        <Text style={styles.propertyDescription}>{section.description}</Text>
                    </View>
                  )
              })
             }
           
         </View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Map</Text>
        </View>
        <View style={{height: 300}}>
          <MapView style={styles.tabContainer}
            initialRegion={{
              latitude: this.props.currentProperty.latitude,
              longitude: this.props.currentProperty.longitude,
              latitudeDelta: 0.00622,
              longitudeDelta: 0.00421,
            }}>
              <Marker
                  coordinate={{latitude: this.props.currentProperty.latitude, longitude: this.props.currentProperty.longitude}}
                  image={require('../../../img/pin.png')}
                />
            </MapView>
        </View>
      </ScrollView>
    )
  }
  
  _renderMapTab(){
    return (
         <MapView style={styles.tabContainer}
            initialRegion={{
              latitude: this.props.currentProperty.latitude,
              longitude: this.props.currentProperty.longitude,
              latitudeDelta: 0.00622,
              longitudeDelta: 0.00421,
            }}>
              <Marker
                  coordinate={{latitude: this.props.currentProperty.latitude, longitude: this.props.currentProperty.longitude}}
                  image={require('../../../img/pin.png')}
                />
            </MapView>
    )
  }

  _renderViewingsTab(){
    return (
      <View style={styles.viewingsTabContainer}>
      
          <FlatList style={{margin:5, flex: 1}}
           data={this.props.currentProperty.viewings}
           keyExtractor={this._keyExtractor}
           renderItem={this._renderItem} 
           extraData={this.props.properties}
           refreshing={this.state.isRefreshing}
           onRefresh={() => this._refresh()}
          />
      
    </View>
    )
  }
  
  _refresh(){
    this.setState({isRefreshing: true});
    this.props.getProperty(this.props.currentProperty.id)
    .then(() => {
      this.setState({isRefreshing: false})
    });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={styles.container}>
              <View style={styles.menuWrapper}>
                <View style={styles.menuTitleContainer}>
                  <TouchableHighlight style={styles.backButton} onPress={() => {this.props.goBack()}} underlayColor={'rgba(0,0,0,0)'}>
                    <MaterialIcons name="chevron-left" style={styles.backButtonIcon}/>
                  </TouchableHighlight>
                  <Text style={styles.menuText}>{this.props.currentProperty.address}</Text>
                  {/* {this.state.activeTab == 1 ? <Text style={styles.menuText}>Info</Text> : null }
                  {this.state.activeTab == 2 ?<Text style={styles.menuText}>Map</Text> : null }
                  {this.state.activeTab == 3 ?<Text style={styles.menuText}>Live Viewings</Text> : null } */}
                </View>
                {/* <View style={styles.menuContainer}>
                        <TouchableHighlight style={styles.menuItemContainer} onPress={ () => { this.setState({activeTab: 1})}} underlayColor={'rgba(0,0,0,0)'}>
                        <View style={this.state.activeTab == 1 ? styles.menuItemActive : styles.menuItem}>
                              <FontAwesomeIcon style={this.state.activeTab == 1 ? styles.menuIconActive : styles.menuIcon} name="info" />
                              { this.state.activeTab == 1 ? <View style={styles.triangle} /> : null }
                          </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.menuItemContainer} onPress={ () => { this.setState({activeTab: 2})}} underlayColor={'rgba(0,0,0,0)'}>
                        <View style={this.state.activeTab == 2 ? styles.menuItemActive : styles.menuItem}>
                              <FontAwesomeIcon style={this.state.activeTab == 2 ? styles.menuIconActive : styles.menuIcon} name="map" />
                              { this.state.activeTab == 2 ? <View style={styles.triangle} /> : null }
                          </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.menuItemContainer} onPress={ () => { this.setState({activeTab: 3})}} underlayColor={'rgba(0,0,0,0)'}>
                        <View style={this.state.activeTab == 3 ? styles.menuItemActive : styles.menuItem}>
                              <FontAwesomeIcon style={this.state.activeTab == 3 ? styles.menuIconActive : styles.menuIcon} name="video-camera" />
                              { this.state.activeTab == 3 ? <View style={styles.triangle} /> : null }
                          </View>
                        </TouchableHighlight>
                  </View> */}
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
              }[this.state.activeTab]}

            </View>
        {
          this.state.activeTab != 3 ? null :
          <TouchableHighlight style={styles.requestViewingButton}>
              <Text style={styles.requestViewingButtonTxt}>Request alternative viewing</Text>
          </TouchableHighlight>
        }
      </View>
    )
  }
}

Property.propTypes = {
    currentProperty: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    goToViewing: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    getProperty: PropTypes.func.isRequired,
  }

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
  //  flex: 1,
    height: 250,
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
  menuWrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
   // width: Dimensions.get('window').width, 
    paddingTop: 30,
    alignItems: 'center',
    paddingBottom: 10
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingRight: 5
  },
  menuItemContainer: {
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'center'
  },
  menuItem: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.VERY_LIGHT_GRAY,
    padding: 7,
    width: 35
  },
  menuItemActive: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.AQUA_GREEN,
    padding: 7,
    alignSelf: 'center',
    width: 35
  },
  menuIcon: {
    color: Colors.VERY_LIGHT_GRAY,
    fontSize: FontSizes.DEFAULT,
  },
  menuIconActive: {
    color: Colors.AQUA_GREEN,
    fontSize: FontSizes.DEFAULT,
  },
  menuTitleContainer:{
    flex: 1,
    flexDirection: 'row',
  },
  backButton: {
    alignSelf: 'center'
  },
  backButtonIcon: {
    fontSize: 45,
    color: Colors.AQUA_GREEN,
  },
  menuText: {
    color: Colors.AQUA_GREEN,
    fontSize: FontSizes.MEDIUM_BIG,
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: 5
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
    height: 40,
    width: 40
  },
  priceBadge:{
    color: Colors.AQUA_GREEN,
    fontSize: FontSizes.DEFAULT,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  propertyTitle: {
    fontSize: FontSizes.TITLE,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    color: Colors.DARK_GREY,
  },
  priceContainer:{
    flexDirection: 'row',
    paddingLeft: 15
  },
  priceUnit: {
    alignSelf: 'flex-end',
    fontSize: FontSizes.DEFAULT,
    paddingBottom: 4
  },
  servicesContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingLeft: 15,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.LIGHT_GRAY,
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20
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
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
  },
  subTitle: {
    fontSize: FontSizes.DEFAULT,
    fontWeight: 'bold',
    color: Colors.DARK_GREY,
    marginTop: 15
  },
  propertyDescription: {
    fontSize: FontSizes.DEFAULT,
    color: Colors.DARK_GREY,
    fontFamily: 'Avenir-Book'
  },
  requestViewingButton: {
    flex: 0.1,
    backgroundColor: Colors.AQUA_GREEN,
    justifyContent: 'center',
    alignItems: 'center'
  },
  requestViewingButtonTxt: {
    alignItems: 'center',
    fontSize: FontSizes.DEFAULT,
    color: 'white'
  },
  imagesContainer: {
    height: 200
  },
  horizontalViewingContainer: {
    maxHeight: 200
  },
  sectionTitleContainer: {
    backgroundColor: Colors.WHITE_SMOKE,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
  },
  sectionTitle: {
    fontSize: FontSizes.DEFAULT, 
    color: Colors.LIGHT_GRAY,
    fontWeight: 'bold'
  },
  address: {
    paddingTop: 5,
    paddingLeft: 15,
    fontSize: FontSizes.DEFAULT,
    color: Colors.LIGHT_GRAY
  },
  noViewingsText: {
    padding: 20,
    fontSize: FontSizes.DEFAULT,
    alignSelf: 'center',
    color: Colors.LIGHT_GRAY
  }
});