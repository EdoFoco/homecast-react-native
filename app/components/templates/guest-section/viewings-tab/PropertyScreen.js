import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Colors from '../../../helpers/ColorPallette';
import MapView from 'react-native-maps';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ListViewDataSource,
  TouchableHighlight,
  Image,
  FlatList,
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
    //flex: 1,
    //flexDirection: 'row',
    alignSelf: 'stretch',
    //height: 80,
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
      padding: 10
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
      fontSize: 20,
      padding: 10, 
      justifyContent: 'center'
    },
    viewingContainer: {
      backgroundColor: Colors.AQUA_GREEN, 
      margin:5, 
      height: 150,
      width: (Dimensions.get('window').width - 39) / 3,
      padding: 5,
      paddingTop: 10
    },
    viewingTitle: {
      alignSelf: 'center',
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold'
    },
    viewingMonth: {
      color: 'white',
      marginTop: 10,
      alignSelf: 'center',
      fontSize: 18
    },
    viewingDay: {
      color: 'white',
      alignSelf: 'center',
      fontSize: 30,
      fontWeight: 'bold'
    },
    viewingTime:{
      color: 'white',
      alignSelf: 'center',
      fontSize: 18
    },
    viewingRemainingSlots:{
      color: 'white',
      fontSize: 12,
      alignSelf: 'center',
      marginTop: 10
    },
    menuContainer: {
      flexDirection: 'row',
      backgroundColor: Colors.DARK_BLUE,
      alignSelf: 'stretch',
      padding: 15,
      borderBottomWidth: 3,
      borderBottomColor: Colors.AQUA_GREEN,
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
      fontSize: 20,
      marginBottom: 5
    },
    menuIconActive: {
      color: Colors.AQUA_GREEN,
      fontSize: 20,
      marginBottom: 5
    },
    menuText: {
      color: 'white',
      fontSize: 14
    },
    menuTextActive: {
      color: Colors.AQUA_GREEN,
      fontSize: 14
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
      borderBottomColor: Colors.AQUA_GREEN,
      position: 'absolute',
      bottom: -15
    },
    viewingMonthHeader: {
      borderBottomWidth: 2,
      flex: 1,
      fontSize: 16
    },
    viewingsListContainer: {
      flex: 1,
      backgroundColor: 'green',
      margin: 20,
      height: 100,
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
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 35,
      paddingLeft: 10,
      paddingRight: 10,
      width: 150
    },
    propertyTitle: {
      fontSize: 28,
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
      fontSize: 26,
      color: Colors.DARK_GREY
    },
    serviceText: {
      fontSize: 14,
      color: Colors.DARK_GREY
    },
    descriptionContainer: {
      marginTop: 15
    },
    subTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.DARK_GREY
    },
    propertyDescription: {
      marginTop: 10,
      fontSize: 14,
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

  _onPress(viewing){
      console.log(viewing);
      //this.props.goToScreen('Viewings');
      this.props.navigation.navigate('Other', { viewing : viewing });
    }

  _keyExtractor = (item, index) => index;
  
  _renderItem = ({item}) => {
    let viewing = item;
    return (
      <TouchableHighlight style={styles.viewingContainer}>
        <View>
            <Text style={styles.viewingTitle}>{new Date(viewing.date_time).toLocaleString('en-us', {  weekday: 'long' })}</Text>
            <Text style={styles.viewingMonth}>{new Date(viewing.date_time).toLocaleString('en-us', {  month: 'short' }).toUpperCase()}</Text>
            <Text style={styles.viewingDay}>{new Date(viewing.date_time).getDate()}</Text>
            <Text style={styles.viewingTime}>{new Date(viewing.date_time).getHours() + ':' + new Date(viewing.date_time).getMinutes()}</Text>
            <Text style={styles.viewingRemainingSlots}>Only 10 slots left</Text>
        </View>
      </TouchableHighlight>
    )
  };

  _renderUserTab(){
    return (
      <View style={styles.tabContainer}>
          <Text>User</Text>
      </View>
    )
  }

  _renderInfoTab(){
    return (
      <View style={styles.tabContainer}>
        <Text style={styles.propertyTitle}>{this.props.currentProperty.name}</Text>
        <View style={styles.servicesContainer}>
                <View style={styles.serviceItem}>
                    <FontAwesomeIcon name="bed" style={styles.serviceIcon} />
                    <Text style={styles.serviceText}>{this.props.currentProperty.rooms} beds</Text> 
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
            <Text style={styles.subTitle}>Info</Text>
            <Text style={styles.propertyDescription}>{this.props.currentProperty.description}</Text>
         </View>
      </View>
    )
  }
  
  _renderMapTab(){
    return (
      <View style={styles.tabContainer}>
      hi
    </View>
    )
  }

  _renderViewingsTab(){
    return (
      <View style={styles.tabContainer}>
      { 
        !this.props.properties.viewingsLoaded ? null :
          <FlatList style={{margin:5}}
           data={this.props.properties.currentPropertyViewings}
           keyExtractor={this._keyExtractor}
           numColumns={3}
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
                  <TouchableHighlight style={styles.menuItemContainer} onPress={ () => { this.props.updatePropertyActiveTab(4)}}>
                    <View style={styles.menuItem}>
                        <FontAwesomeIcon style={this.props.propertyScreen.activeTab == 3 ? styles.menuIconActive : styles.menuIcon} name="user" />
                        <Text style={this.props.propertyScreen.activeTab == 3 ? styles.menuTextActive : styles.menuText}>Landlord</Text> 
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
              ),
              4: (
                this._renderUserTab()
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
  

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

const mapStateToProps = (state, navigation) => {
    var rowIds = state.properties.currentPropertyViewings.map((row, index) => index);
    
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        viewings: ds.cloneWithRows(state.properties.currentPropertyViewings, rowIds),
        currentProperty: navigation.navigation.state.params.property,
        propertyScreen: state.propertyScreen,
        properties: state.properties
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyScreen);
