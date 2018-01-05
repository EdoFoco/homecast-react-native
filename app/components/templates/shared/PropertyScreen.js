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
    height: 200
  },
  tabContainer:{
      flex: 1,
      alignSelf: 'stretch',
      alignContent: 'flex-start',
      //flexDirection: 'row',
      padding: 10,
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
      paddingRight: 10
    },
    menuContainer: {
      flexDirection: 'row',
      backgroundColor: Colors.DARK_BLUE,
      alignSelf: 'stretch',
      padding: 15,
      borderBottomWidth: 3,
     // borderBottomColor: Colors.LIGHT_RED,
      alignItems: 'center',
    },
    menuItemContainer: {
      alignItems: 'center',
      alignSelf: 'center',
      height: 40,
      flex: 1
    },
    menuItem: {
      alignItems: 'center',
      alignSelf: 'center',
    },
    menuIcon: {
      color: 'white',
      fontSize: FontSizes.DEFAULT,
      marginBottom: 5
    },
    menuIconActive: {
      color: Colors.AQUA_GREEN,
      fontSize: FontSizes.DEFAULT,
      marginBottom: 5
    },
    menuText: {
      color: 'white',
      fontSize: FontSizes.SMALL_TEXT
    },
    menuTextActive: {
      color: Colors.AQUA_GREEN,
      fontSize: FontSizes.SMALL_TEXT
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 7,
      borderRightWidth: 7,
      borderBottomWidth: 7,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      position: 'absolute',
      bottom: -15
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
      backgroundColor: '#2EC4B6',
      top: 150,
      color: 'white',
      position: 'relative',
      left: 0,
      fontSize: FontSizes.SMALL_TEXT,
      fontWeight: 'bold',
      lineHeight: 35,
      paddingLeft: 10,
      paddingRight: 10,
      width: 150
    },
    propertyTitle: {
      fontSize: FontSizes.BIG,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      color: Colors.DARK_GREY
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

class PropertyScreen extends Component{

  componentWillMount(){
   
    this.props.updateCurrentProperty(this.props.currentProperty);
    
    this.props.getPropertyViewings(this.props.currentProperty.id)
    .then((viewings) => {
      var sorted = viewings.sort(function(a, b) {
        a = new Date(a.date_time);
        b = new Date(b.date_time);
        return a<b ? -1 : a>b ? 1 : 0;
      });

      this.props.updateCurrentPropertyViewings(sorted);
      this.props.updateViewingsLoaded(true);
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  _goToViewing(viewingId){
      //this.props.navigation.navigate('Other', { viewing : viewing });
      this.props.getViewing(viewingId)
      .then((viewing) => {
          this.props.navigation.navigate('Viewing', { viewing : viewing });
      })
      .catch((error) => {
        console.error(error);
      });
    }

  _keyExtractor = (item, index) => index;
  
  _renderItem = ({item}) => {
    let viewing = item;
    return (
      <TouchableHighlight onPress={() => {this._goToViewing(viewing.id)}}>
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
        <Text style={styles.propertyTitle}>{this.props.currentProperty.name}</Text>
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
    console.log(this.props.navigation);
    return (
      <View style={styles.viewingsTabContainer}>
      { 
        !this.props.properties.viewingsLoaded ? null :
          <FlatList style={{margin:5}}
           data={this.props.properties.currentProperty.viewings}
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
              <View style={{flexDirection: 'row'}} >
                    <Image source={{uri: this.props.currentProperty.thumbnail}} style={styles.backgroundImage} >
                      <Text style={styles.priceBadge}>£ {Math.round(this.props.currentProperty.price)} p/m</Text>
                    </Image>
                </View>
            <View style={styles.menuContainer}>
                  <TouchableHighlight style={styles.menuItemContainer} onPress={ () => { this.props.updatePropertyActiveTab(1)}}>
                    <View style={styles.menuItem}>
                        <FontAwesomeIcon style={this.props.propertyScreen.activeTab == 1 ? styles.menuIconActive : styles.menuIcon} name="info" />
                        <Text style={this.props.propertyScreen.activeTab == 1 ? styles.menuTextActive : styles.menuText}>Info</Text> 
                        { this.props.propertyScreen.activeTab == 1 ? <View style={styles.triangle} /> : null }
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight style={styles.menuItemContainer} onPress={ () => { this.props.updatePropertyActiveTab(2)}}>
                    <View style={styles.menuItem}> 
                        <FontAwesomeIcon style={this.props.propertyScreen.activeTab == 2 ? styles.menuIconActive : styles.menuIcon} name="map" />
                        <Text style={this.props.propertyScreen.activeTab == 2 ? styles.menuTextActive : styles.menuText}>Map</Text> 
                        { this.props.propertyScreen.activeTab == 2 ? <View style={styles.triangle} /> : null }
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight style={styles.menuItemContainer} onPress={ () => { this.props.updatePropertyActiveTab(3)}}>
                    <View style={styles.menuItem}> 
                        <FontAwesomeIcon style={this.props.propertyScreen.activeTab == 3 ? styles.menuIconActive : styles.menuIcon} name="video-camera" />
                        <Text style={this.props.propertyScreen.activeTab == 3 ? styles.menuTextActive : styles.menuText}>Live Streams</Text> 
                        { this.props.propertyScreen.activeTab == 3 ? <View style={styles.triangle} /> : null }
                    </View>
                  </TouchableHighlight>
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

PropertyScreen.navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.property.name}`,
  });
  

const mapStateToProps = (state, navigation) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        currentProperty: navigation.navigation.state.params.property,
        propertyScreen: state.propertyScreen,
        properties: state.properties
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyScreen);
