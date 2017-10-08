import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as Colors from '../../../helpers/ColorPallette';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ListViewDataSource,
  TouchableHighlight,
  Image
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
  viewingsContainer:{
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'center'
  },
  viewingsList: {
    //  height: 80
    backgroundColor: 'blue'
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
      margin:10, 
      padding:10, 
      height: 60,
      width: 60,
      flex: 1
    },
    time: {
      color: 'white'
    },
    date: {
      color: 'white'
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
      height: 100
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
    }
});

class PropertyScreen extends Component{

  componentWillMount(){
   
    this.props.getPropertyViewings(this.props.currentProperty.id)
    .then((viewings) => {
      var sorted = viewings.sort(function(a, b) {
        a = new Date(a.date_time);
        b = new Date(b.date_time);
        return a<b ? -1 : a>b ? 1 : 0;
      });

      var byMonth = [];

      sorted.forEach(function(viewing, key){
        var date = new Date(viewing.date_time);
        var month = date.toLocaleString('en-gb', { month: "long" });
       
        if(byMonth.length == 0){
          byMonth.push({
            month: month,
            viewings: [ viewing ]
          });
        }
        else{
          var monthlyViewings = byMonth.find( m => m.month == month);
          if(monthlyViewings){
            monthlyViewings.viewings.push(viewing);
          }
          else{
            byMonth.push({
              month: month,
              viewings: [ viewing ]
            });
          }
        }
      })
      
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

  _renderViewing(viewing){
    return <View style={styles.viewingContainer}/>
  }
  _renderViewings(viewings){
      

      return(
        <View style={styles.viewingWrapper}>
        { 
          
          viewings.forEach((viewing) => {
            this._renderViewing(viewing);
            
            })
          /*viewings.map((viewing) => {
                <TouchableHighlight style={styles.viewingButton} onPress={() => this._onPress(viewing)}>
                  <View style={styles.viewingContainer}>
                      <Text style={styles.time}>{new Date(viewing.date_time).getHours() + ':' + new Date(viewing.date_time).getMinutes()}</Text>
                      <Text style={styles.date}>{new Date(viewing.date_time).getDay() + ' ' +  ' ' + new Date(viewing.date_time).getFullYear()}</Text>
                  </View>
            </TouchableHighlight>
          })*/
        }
        </View>
      );
  }

  _renderRow = function(monthlyViewings, rowId){
   // var date = new Date(viewing.date_time);
    //var month = date.toLocaleString("en-gb", { month: "long" });
    return (
          <View style={styles.viewingsListContainer}>
            {
             this._renderViewings(monthlyViewings.viewings)
            }
          </View>
        )
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={{flexDirection: 'row'}} >
                <Image source={{uri: this.props.currentProperty.thumbnail}} style={styles.backgroundImage} />
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
                    <FontAwesomeIcon style={this.props.propertyScreen.activeTab == 2 ? styles.menuIconActive : styles.menuIcon} name="video-camera" />
                    <Text style={this.props.propertyScreen.activeTab == 2 ? styles.menuTextActive : styles.menuText}>Live Streams</Text> 
                    { this.props.propertyScreen.activeTab == 2 ? <View style={styles.triangle} /> : null }
                </View>
              </TouchableHighlight>
              <TouchableHighlight style={styles.menuItemContainer} onPress={ () => { this.props.updatePropertyActiveTab(3)}}>
                <View style={styles.menuItem}>
                    <FontAwesomeIcon style={this.props.propertyScreen.activeTab == 3 ? styles.menuIconActive : styles.menuIcon} name="user" />
                    <Text style={this.props.propertyScreen.activeTab == 3 ? styles.menuTextActive : styles.menuText}>Landlord</Text> 
                    { this.props.propertyScreen.activeTab == 3 ? <View style={styles.triangle} /> : null }
                </View>
              </TouchableHighlight>
         </View>
         <View style={styles.viewingsContainer}>
           { 
             !this.props.properties.viewingsLoaded ? null :

            <ListView
                dataSource={this.props.viewings}
                enableEmptySections={true}
                style={styles.viewingsList}
                renderRow={(rowData, rowId) => this._renderRow(rowData, rowId)} 
            />
           }
         </View>
         
      </View>

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
    console.log('PropertyScreen');
    console.log(state);
    console.log(navigation);
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
