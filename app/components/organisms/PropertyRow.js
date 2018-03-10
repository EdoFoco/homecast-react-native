import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import * as Colors from '../helpers/ColorPallette';
import * as FontSizes from '../helpers/FontSizes';
import FastImage from 'react-native-fast-image';
import {
    StyleSheet,
    TouchableHighlight,
    View,
    Text
} from 'react-native';

export default class PropertyRow extends Component{

  render() {
    return (
        <TouchableHighlight style={styles.propertyButton} onPress={() => this.props.onPress(this.props.property)} underlayColor='rgba(0,0,0,0)'>
            <View style={styles.propertContainer}>
                <FastImage
                    style={styles.backgroundImage}
                    source={{
                        uri: this.props.property.thumbnail,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            <View style={{flex:1, flexDirection: 'column'}}>
                <View style={{flex:1}}/>
                <FastImage source={{uri: this.props.property.user.profile_picture}} style={styles.profilePicture}/>
                <View style={styles.propertyDescriptionWrapper}>
                    <Text style={styles.propertyTitle}>{this.props.property.name}</Text>
                    <Text style={styles.descriptionText}>{this.props.property.address}</Text>
                    <View style={styles.iconsContainer}>
                        <FontAwesomeIcon name="bed" style={styles.descriptionIcon} /> 
                        <Text style={styles.iconText}>{this.props.property.bedrooms}</Text>
                        <FontAwesomeIcon name="bath" style={styles.descriptionIcon} /> 
                        <Text style={styles.iconText}>{this.props.property.bathrooms}</Text>
                    </View>
                    <Text style={styles.priceBadge}>£ {Math.round(this.props.property.price)} p/m</Text>
                </View>
            </View>
        </View>
        </TouchableHighlight>
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
        alignItems: 'center'
    },
    backgroundImage: {
        flex: 1,
        height: 200
    },
    propertContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    propertyDescriptionWrapper: {
        alignSelf: 'stretch',
        height: 100,
        padding: 20,
        paddingTop: 10
    },
    propertyTitle: {
        color: Colors.DARK_GREY,
        fontSize: FontSizes.DEFAULT
    },
    descriptionText: {
        color: Colors.VERY_LIGHT_GRAY,
        fontSize: FontSizes.SMALL_TEXT
    },
    priceBadge:{
        color: Colors.AQUA_GREEN,
      //  top: 150,
        position: 'absolute',
        right: 0,
        bottom: 10,
        fontSize: FontSizes.SMALL_TEXT,
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
        flex: 1
    },
    descriptionIcon: {
        fontSize: FontSizes.DEFAULT,
        marginRight: 10,
        color: Colors.LIGHT_GRAY
    },
    iconText: {
        marginLeft: 5,
        marginRight:10,
        color: Colors.LIGHT_GRAY
    },
    favouriteIconContainer:{
        position: 'absolute',
        top: 0,
        right: 0
    },
    favouriteIcon:{
        color: Colors.RED,
        fontSize: 34
    }
});