import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight
} from 'react-native';

class ViewingsContainer extends Component{
 
    _goToViewing(viewingId, property){
       this.props.goToGuestViewingsScreen(viewingId, property);
       this.props.navigation.navigate('ViewingsStack');
      }

      
    _toDateString(date){
        let weekday = new Date(`${date}`).toLocaleString('en-us', {  weekday: 'short' });
        let day = new Date(`${date}`).getDate();
        let month = new Date(`${date}`).toLocaleString('en-us', {  month: 'short' });
        let year = new Date(`${date}`).toLocaleString('en-us', {  year: 'numeric' });
    
        return `${weekday}, ${day} ${month}`;
      }
    
    _renderRow = function({item}){
        let viewing = item;
        let property = this.props.properties.find(p => p.viewings.find( v => v.id == viewing.id));
        return (
          <TouchableHighlight onPress={() => {this._goToViewing(viewing.id, property)}}>
            <View style={styles.viewingContainer}>
                <View style={styles.viewingDateContainer}>
                    <Text style={styles.dateStyle}>{this._toDateString(viewing.date_time)}</Text>
                    <Text style={styles.viewingTime}>{new Date(`${viewing.date_time}`).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()}</Text>
                </View>    
                <Text style={styles.descriptionText}>{property.address.replace(', UK', '')}</Text>
                <View style={styles.detailsContainer}>
                    <View style={styles.participantsContainer}>
                        <Text style={styles.participants}>{10 - viewing.capacity}</Text>
                        <Text style={styles.participantsLabel}>Attendee(s)</Text>
                    </View>
                    <FastImage style={styles.propertyThumb} source={{url: property.images[0].url}} />
                </View>
            </View>
          </TouchableHighlight>
          )
      }
    
      render() {
        if(this.props.viewings.length == 0) {
          return(
            <View style={styles.noViewingsContainer}>
              <View style={{height: 25, backgroundColor: Colors.DARK_BLUE}}></View>
              <Text style={styles.noViewingsMessage}>You haven't created any viewings. Choose a property and create a live viewing.</Text>
            </View>
          )
        }
    
        return (
          <View style={styles.container}>
            <View style={{height: 25, backgroundColor: Colors.DARK_BLUE}}></View>
            <FlatList
              data={this.props.viewings}
              renderItem={(viewing) => this._renderRow(viewing)}
              keyExtractor={(item, index) => index.toString()}
              removeClippedSubviews={false}
            />
            <NetworkErrorMessage isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
          </View>
    
        )
      }
}

ViewingsContainer.navigationOptions = {
  tabBarLabel: 'Viewings',
  tabBarIcon: ({ tintColor }) => (
      <Icon name="calendar-clock"  size={24} color={tintColor} style={{height: 24, width: 24}} />
    ),
};


const mapStateToProps = (state) => {
    var properties = [...state.properties.propertiesList];
    var viewings = properties.map(p => p.viewings);
    viewings = [].concat.apply([], viewings);

    var sortedViewings = viewings.sort((a, b) => {
        return new Date(a.date_time) - new Date(b.date_time);
    });

    return {
        user: state.user,
        network: state.network,
        viewings: sortedViewings,
        properties: state.properties.propertiesList
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingsContainer);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
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
    width: 100,
    alignSelf: 'flex-start',
  },
  propertyName: {
    fontSize: FontSizes.DEFAULT,
    textAlign: 'left',
    flex: 1,
    paddingLeft: 10,
  },
  viewingTime:{
    flex: 0.7,
    fontSize: FontSizes.DEFAULT,
    textAlign: 'right',
    color: Colors.DARK_GREY,
    paddingRight: 10,
    fontWeight: 'bold'
  },
  propertyThumb: {
    height: 120,
    width: 200,
    flex: 0.5,
    borderRadius: 5
  },
  propertyDescriptionWrapper: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'blue'
  },
  propertyTitle: {
      color: Colors.DARK_GREY,
      fontSize: FontSizes.DEFAULT
  },
  descriptionText: {
      color: Colors.LIGHT_GRAY,
      fontSize: FontSizes.DEFAULT
  }, 
  weekDayStyle: {
    color: 'white',
    fontSize: FontSizes.DEFAULT,
  },
  viewingDateContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  viewingTime:{
      fontSize: FontSizes.MEDIUM_BIG,
      textAlign: 'right',
      color: Colors.DARK_GREY,
      alignSelf: 'flex-end'
  },
  dateStyle:{
      fontSize: FontSizes.MEDIUM_BIG,
      color: Colors.DARK_GREY,
      flex: 0.9,
      textAlign: 'left',
      alignSelf: 'flex-end'
  },
  viewingContainer: {
    padding: 10,
    paddingTop: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.LIGHT_GRAY,
    paddingBottom: 20,
    flex: 1
  },
  priceWrapper: {
    flexDirection: 'row',
  },
  price: {
    fontSize: FontSizes.TITLE,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: FontSizes.DEFAULT,
    paddingTop: 7
  },
  iconWrapper: {
    alignItems: 'center'
  },
  
  iconsContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  descriptionIcon: {
    fontSize: FontSizes.DEFAULT,
    color: Colors.DARK_GREY
  },
  iconText: {
    marginLeft: 5,
    marginRight:10,
    color: Colors.DARK_GREY,
  },
  viewingsContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
},
viewingTitleWrapper: {
    marginTop: 0,
    borderRadius: 5,
    flex: 0.7,
    justifyContent: 'center',
    justifyContent: 'flex-start'
},
viewingsTitle: {
    color: Colors.LIGHT_GRAY,
    fontSize: FontSizes.DEFAULT,
    alignSelf: 'flex-start',
},
videoIcon: {
   color: Colors.AQUA_GREEN,
   fontSize: FontSizes.TITLE,
   alignSelf: 'flex-start',
},
noViewingsContainer: {
  flex: 1,
  backgroundColor: 'white',
  justifyContent: 'center',
  paddingRight: 40,
  paddingLeft: 40
},
noViewingsMessage: {
  color: Colors.LIGHT_GRAY,
  alignSelf: 'center',
  fontSize: FontSizes.DEFAULT,
  textAlign: 'center'
},
detailsContainer: {
    flexDirection: 'row',
    flex: 1
},
participantsContainer:{
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
},
participants: {
    fontSize: FontSizes.TITLE,
    color: Colors.AQUA_GREEN
},
participantsLabel: {
    color: Colors.AQUA_GREEN,
    fontSize: FontSizes.DEFAULT
}
});