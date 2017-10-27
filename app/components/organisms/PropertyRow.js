import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import * as Colors from '../helpers/ColorPallette';
import * as FontSizes from '../helpers/FontSizes';
import {
    StyleSheet,
    TouchableHighlight,
    View,
    Text,
    Image
} from 'react-native';

const styles = StyleSheet.create({
    propertyButton:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
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
        color: '#011627',
        fontSize: FontSizes.DEFAULT
    },
    descriptionText: {
        color: '#9E9E9E'
    },
    priceBadge:{
        backgroundColor: '#2EC4B6',
        top: 150,
        color: 'white',
        position: 'relative',
        left: 0,
        fontSize: FontSizes.DEFAULT,
        fontWeight: 'bold',
        lineHeight: 35,
        paddingLeft: 10,
        paddingRight: 10,
        width: 150
    },
    profilePicture: {
        width: 80,
        height: 80,
        position: 'absolute',
        top: -40,
        right: 10,
        alignSelf: 'flex-end',
        borderRadius: 40,
        backgroundColor: 'blue'
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


export default class PropertyRow extends Component{

  render() {
    return (
        <TouchableHighlight style={styles.propertyButton} onPress={() => this.props.onPress(this.props.property)} underlayColor='rgba(0,0,0,0)'>
            <View style={styles.propertContainer}>
            <Image source={{uri: this.props.property.thumbnail}} style={styles.backgroundImage} >
                { !this.props.enableFavourites ? null :
                    <View style={styles.favouriteIconContainer}>
                    <MaterialCommunityIcon.Button 
                        name={this.props.property.isFavourite ? 'heart': 'heart-outline'} 
                        backgroundColor='rgba(0,0,0,0)' 
                        iconStyle={styles.favouriteIcon} 
                        onPress={ this.props.property.isFavourite ? () => {this.props.onRemoveFromFavourites(this.props.user.id, this.props.property.id) } : () => { this.props.onAddToFavourites(this.props.user.id, this.props.property.id)}} /> 
                    </View>
                }
                <Text style={styles.priceBadge}>£ {Math.round(this.props.property.price)} p/m</Text>
            </Image>
            <View style={{flex:1, flexDirection: 'column'}}>
                <View style={{flex:1}}/>
                <Image source={{uri: this.props.property.user.profile_picture}} style={styles.profilePicture}/>
                <View style={styles.propertyDescriptionWrapper}>
                    <Text style={styles.propertyTitle}>{this.props.property.name}</Text>
                    <Text style={styles.descriptionText}>{this.props.property.address}</Text>
                    <View style={styles.iconsContainer}>
                        <FontAwesomeIcon name="bed" style={styles.descriptionIcon} /> 
                        <Text style={styles.iconText}>{this.props.property.bedrooms}</Text>
                        <FontAwesomeIcon name="bath" style={styles.descriptionIcon} /> 
                        <Text style={styles.iconText}>{this.props.property.bathrooms}</Text>
                    </View>
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

