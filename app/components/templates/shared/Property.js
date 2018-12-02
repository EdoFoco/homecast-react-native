import React, { Component} from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import PropTypes from 'prop-types';
import ViewingRow from './ViewingRow';
import PlaceholderFastImage from './PlaceholderFastImage';
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

export default class Property extends Component{

  constructor(props) {
    super(props);

    this.state = {
        activeTab: 1,
        isRefreshing: false
    }
   }
   
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
    return(  
      <View style={{ width:  Dimensions.get('window').width }}>
        <PlaceholderFastImage
            style={styles.backgroundImage}
            source={{
                uri: image ? image.url : '',
                priority: FastImage.priority.normal,
            }}
        />
      </View>
    ) 
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
        <View style={{flexDirection: 'row', marginBottom: 20, 'flex': 1, 'backgroundColor': 'black'}} >
          <FlatList
              style={styles.imagesContainer}
              data={this.props.currentProperty.images}
              renderItem={(image) => this._renderImage(image)}
              keyExtractor={(index) => index.toString()}
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
              keyExtractor={(index) => index.toString()}
              removeClippedSubviews={false}
              
          />
        } 
        </View>
        <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
          </View>    
         <View style={styles.descriptionContainer}>
            <View>
                <Text style={styles.propertyDescription}>{this.props.currentProperty.description}</Text>
            </View>
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
                </View>
              </View>
              {
                  this._renderInfoTab()
              }
            </View>
        {
          !this.props.showContactAgent ? null :
          <TouchableHighlight style={styles.contactAgentButton} onPress={() => {this.props.contactAgent()}}>
              <Text style={styles.contactAgentButtonTxt}>Contact Agent</Text>
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
    contactAgent: PropTypes.func,
    showContactAgent: PropTypes.bool.isRequired
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
    backgroundColor: Colors.DARK_BLUE,
   // width: Dimensions.get('window').width, 
    paddingTop: 20,
    alignItems: 'center',
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
    fontSize: FontSizes.DEFAULT,
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: 5,
    flex: 0.9
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
    borderBottomWidth: 0,
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
    color: Colors.DARK_GREY
  },
  contactAgentButton: {
    flex: 0.1,
    backgroundColor: Colors.AQUA_GREEN,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactAgentButtonTxt: {
    alignItems: 'center',
    fontSize: FontSizes.DEFAULT,
    color: 'white'
  },
  imagesContainer: {
    height: 250,
    backgroundColor: 'rgba(0,0,0,0.6)'
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