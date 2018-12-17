import React, { Component } from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewingCell from '../templates/shared/ViewingCell';
import PropTypes from 'prop-types';
import * as Colors from '../helpers/ColorPallette';
import * as FontSizes from '../helpers/FontSizes';
import FastImage from 'react-native-fast-image';
import PlaceholderFastImage from '../templates/shared/PlaceholderFastImage';
import {
    StyleSheet,
    TouchableHighlight,
    View,
    Text,
    FlatList,
    Dimensions
} from 'react-native';

export default class PropertyRow extends Component{

  _renderImage(item){
    let image = item.item;
    if(image){
      return(  
        <TouchableHighlight style={{ width:  Dimensions.get('window').width, padding: 10, paddingTop: 15 }} onPress={() => this.props.onPress(this.props.property)}>
          <PlaceholderFastImage style={styles.backgroundImage} 
            source={{uri: image.url, priority: FastImage.priority.normal}} 
            resizeMode={FastImage.resizeMode.cover} />
        </TouchableHighlight>
      )   
    }
  }

  _toDateString(date){
    let weekday = new Date(`${date}`).toLocaleString('en-us', {  weekday: 'short' });
    let day = new Date(`${date}`).getDate();
    let month = new Date(`${date}`).toLocaleString('en-us', {  month: 'short' });
    let year = new Date(`${date}`).toLocaleString('en-us', {  year: 'numeric' });

    return `${weekday}, ${day} ${month} ${year}`;
}

  render() {
    return (
        <View style={styles.propertyButton}  underlayColor='rgba(0,0,0,0)'>
            <View style={styles.propertContainer}>
                <FlatList
                    style={styles.imagesContainer}
                    data={this.props.property.images}
                    renderItem={(image) => this._renderImage(image)}
                    keyExtractor={(index) => index.toString()}
                    removeClippedSubviews={false}
                    horizontal
                    pagingEnabled
                />
                 { !this.props.enableFavourites ? null :
                    <View style={styles.favouriteIconContainer}>
                    <MaterialCommunityIcon.Button 
                        name={this.props.property.isFavourite ? 'heart': 'heart-outline'} 
                        backgroundColor='rgba(0,0,0,0)' 
                        iconStyle={styles.favouriteIcon} 
                        onPress={ this.props.property.isFavourite ? () => {this.props.onRemoveFromFavourites(this.props.user.id, this.props.property.id) } : () => { this.props.onAddToFavourites(this.props.user.id, this.props.property.id)}} /> 
                    </View>
                }
            <TouchableHighlight style={{flex:1}} onPress={() => this.props.onPress(this.props.property)}>
                <View tyle={styles.infoContainer} >
                    <View style={styles.propertyDescriptionWrapper}>
                        <View style={styles.leftWrapper}>
                            <View style={styles.priceWrapper}>
                                <Text style={styles.price}>£{Math.round(this.props.property.price)}</Text>
                                <Text style={styles.priceUnit}>/month</Text>
                            </View>
                            <Text style={styles.descriptionText}>{this.props.property.address.replace(', UK', '')}</Text>
                        </View>
                        <View style={styles.rightWrapper}>
                            <View style={styles.iconsContainer}>
                                <View style={styles.iconWrapper}>
                                    <FontAwesomeIcon name="bed" style={styles.descriptionIcon} /> 
                                    <Text style={styles.iconText}>{this.props.property.bedrooms} beds</Text>
                                </View>
                                <View style={styles.iconWrapper}>
                                    <FontAwesomeIcon name="bath" style={styles.descriptionIcon} /> 
                                    <Text style={styles.iconText}>{this.props.property.bathrooms} baths</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.viewingsContainer}>
                        <MaterialCommunityIcon name="calendar-clock" style={styles.videoIcon} />
                       
                        <View style={styles.viewingTitleWrapper}>
                            <Text style={styles.viewingsTitle}> Next Live Viewing: </Text>
                        </View>
                        {
                                !this.props.property.nextViewing  ?
                                <Text style={styles.viewingDate}> Not scheduled</Text> :
                                <Text style={styles.viewingDate}> {this._toDateString(this.props.property.nextViewing.date_time)}</Text>
                        }
                    </View>
                </View>
            </TouchableHighlight>
        </View>
        </View>
    );
  }
}

PropertyRow.propTypes = {
    property: PropTypes.object,
    user: PropTypes.object,
    onPress: PropTypes.func,
    enableFavourites: PropTypes.bool,
    onAddToFavourites: PropTypes.func,
    onRemoveFromFavourites: PropTypes.func
}  


const styles = StyleSheet.create({
    propertyButton:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: Colors.VERY_LIGHT_GRAY,
        paddingBottom: 20
    },
    imagesContainer:{
        flex: 1,
        height: 250
    },
    backgroundImage: {
        height: 250,
        borderRadius: 5,
    },
    propertContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    propertyDescriptionWrapper: {
        alignSelf: 'stretch',
        flex: 0.2,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
    },
    propertyTitle: {
        color: Colors.DARK_GREY,
        fontSize: FontSizes.DEFAULT
    },
    descriptionText: {
        color: Colors.LIGHT_GRAY,
        fontSize: FontSizes.SMALL_TEXT,
        paddingRight: 10
    },
    priceBadge:{
        color: Colors.AQUA_GREEN,
        position: 'absolute',
        right: 0,
        top: 0,
        fontSize: FontSizes.MEDIUM_BIG,
        fontWeight: 'bold',
        lineHeight: 35,
        paddingRight: 10,
        textAlign: 'right',
    },
    profilePicture: {
        width: 80,
        height: 80,
        position: 'absolute',
        top: -40,
        right: 10,
        alignSelf: 'flex-end',
        borderRadius: 40
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
       // fontSize: FontSizes
    },
    favouriteIconContainer:{
        position: 'absolute',
        top: 15,
        right: 0
    },
    favouriteIcon:{
        color: Colors.RED,
        fontSize: 34
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
    leftWrapper: {
        flex: 0.7,
    },
    rightWrapper: {
        flex: 0.3
    },
    viewingsContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        flexDirection: 'row'
    },
    viewingTitleWrapper: {
        //backgroundColor: Colors.AQUA_GREEN,
        marginTop: 0,
        borderRadius: 5,
        flex: 1,
        justifyContent: 'center'
    },
    viewingsTitle: {
        color: Colors.LIGHT_GRAY,
        fontSize: FontSizes.DEFAULT,
        textAlignVertical: 'center'
    },
   viewingDate: {
        //flex: 0.7,
        fontSize: FontSizes.DEFAULT,
        textAlign: 'right',
        color: Colors.DARK_GREY,
        fontWeight: 'bold',
        alignSelf: 'center'
   },
   videoIcon: {
       color: Colors.AQUA_GREEN,
       fontSize: FontSizes.TITLE
   }
});