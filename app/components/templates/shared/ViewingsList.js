import React, { Component} from 'react';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PlaceholderFastImage from './PlaceholderFastImage';
import FastImage from 'react-native-fast-image';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList
  } from 'react-native'; 

export default class ViewingsList extends Component{
  
    constructor(props){
      super(props);

      let viewings = this._getSortedViewings();
      this.state = {
        viewings: viewings,
        viewingDates: this._getViewingDates(viewings)
      }
    }

    _getSortedViewings(){
      var sortedViewings = this.props.viewings.sort((a, b) => {
          return new Date(a.date_time) - new Date(b.date_time);
      });
  
      return sortedViewings;
    }

    _getViewingDates(sortedViewings){
      return [...new Set(sortedViewings.map(v => {
        let weekday = new Date(`${v.date_time}`).toLocaleString('en-us', {  weekday: 'short' });
        let day = new Date(`${v.date_time}`).getDate();
        let month = new Date(`${v.date_time}`).toLocaleString('en-us', {  month: 'short' });
        let year = new Date(`${v.date_time}`).toLocaleString('en-us', {  year: 'numeric' });
        return `${weekday}, ${day} ${month}`;
      }))];
    }

    _toDateString(date){
      let weekday = new Date(`${date}`).toLocaleString('en-us', {  weekday: 'short' });
      let day = new Date(`${date}`).getDate();
      let month = new Date(`${date}`).toLocaleString('en-us', {  month: 'short' });

      return `${weekday}, ${day} ${month}`;
    }

    _renderViewingRow({item}){
      let viewing = item;
      return(
        <TouchableOpacity activeOpacity={1.0} onPress={() => {this.props.goToViewing(viewing.id, viewing.property)}}>
            <View style={styles.viewingContainer}>
                <View style={styles.badge}></View>
                <View style={styles.viewingDateContainer}>
                    <Text style={styles.viewingTime}>{new Date(`${viewing.date_time}`).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()}</Text>
                </View> 
                <View style={styles.detailsContainer}>
                  <Icon name="check-circle" style={styles.icon} />
                  <Text style={styles.descriptionText}>{viewing.property.address.split(',')[0]}</Text>
                  <Text style={styles.participantsLabel}>{10 - viewing.capacity} Attendee(s)</Text>
                </View>
                <PlaceholderFastImage style={styles.imageThumb} 
                  source={{uri: viewing.property.images[0].url, priority: FastImage.priority.normal}} 
                  resizeMode={FastImage.resizeMode.cover} />
            </View>
        </TouchableOpacity>
      )
    }

    _renderViewingsByDate({item}){
      var date = item;
      var viewings = this.state.viewings.filter(v => {
        let dateText = this._toDateString(v.date_time);
        return dateText === date;
      });

      return(
        <View>
          <View style={styles.dividerContainer}>
            <Text style={styles.dividerText}>{this._toDateString(date)}</Text>
          </View>
          <FlatList
              data={viewings}
              renderItem={(viewing) => this._renderViewingRow(viewing)}
              keyExtractor={(item, index) => index.toString()}
              removeClippedSubviews={false}
            />
        </View>
      )
    }

    render() {
      console.log(this.state);
      if(this.state.viewings.length == 0) {
        return(
          <View style={styles.noViewingsContainer}>
            <Text style={styles.noViewingsMessage}>{this.props.noViewingsMessage}</Text>
          </View>
        )
      }
  
      return (
        <View style={styles.container}>
          <View style={{height: 25, backgroundColor: Colors.DARK_BLUE}}></View>

          <FlatList
            data={this.state.viewingDates}
            renderItem={(date) => this._renderViewingsByDate(date)}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={false}
          />
        </View>
      )
    }
}

ViewingsList.PropTypes = {
  viewings: PropTypes.array.isRequired,
  goToViewing: PropTypes.func.isRequired,
  noViewingsMessage: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  viewingDateContainer: {
      flex: 0.3,
      flexDirection: 'row',
      justifyContent: 'center',
      borderRightWidth: 0.5,
      borderColor: Colors.VERY_LIGHT_GRAY
    },
    viewingTime:{
        fontSize: FontSizes.DEFAULT,
        color: Colors.DARK_GREY,
        fontWeight: 'bold',
        alignSelf: 'center',
        justifyContent: 'center',
      },
    dateStyle:{
        fontSize: FontSizes.DEFAULT,
        color: Colors.LIGHT_GRAY,
        flex: 0.3,
        textAlign: 'left',
    },
    viewingContainer: {
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.LIGHT_GRAY,
      flex: 1,
      flexDirection: 'row',
    },
    badge: {
      backgroundColor: Colors.AQUA_GREEN,
      height: 80,
      width: 10
    },
    detailsContainer: {
      flex: 0.6
    },
    icon: {
      color: Colors.AQUA_GREEN,
      position: 'absolute',
      left: -12,
      fontSize: 22,
      top: 15,
      backgroundColor: 'white'
    },
    descriptionText: {
      marginLeft: 20,
      marginTop: 10,
      marginRight: 10,
      fontSize: FontSizes.DEFAULT
    },
    participantsLabel: {
      fontSize: FontSizes.DEFAULT,
      color: Colors.LIGHT_GRAY,
      marginTop: 10,
      marginLeft:20
    },
    dividerContainer: {
      backgroundColor: Colors.WHITE_SMOKE,
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 10,
    },
    dividerText: {
      fontSize: FontSizes.DEFAULT, 
      color: Colors.LIGHT_GRAY,
      fontWeight: 'bold'
    },
    imageThumb: {
      flex: 0.3
    }
});