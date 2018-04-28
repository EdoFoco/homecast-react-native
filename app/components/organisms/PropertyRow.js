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
    Text,
    FlatList,
    Dimensions
} from 'react-native';

export default class PropertyRow extends Component{

  _renderImage(item){
    let image = item.item;
    if(image){
      return(  
        <TouchableHighlight style={{ width:  Dimensions.get('window').width }} onPress={() => this.props.onPress(this.props.property)}>
          <FastImage
              style={styles.backgroundImage}
              source={{
                  uri: image.url,
                  priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableHighlight>
      )   
    }
  }

  render() {
    return (
        <View style={styles.propertyButton}  underlayColor='rgba(0,0,0,0)'>
            <View style={styles.propertContainer}>
                <FlatList
                    style={styles.imagesContainer}
                    data={this.props.property.images}
                    renderItem={(image) => this._renderImage(image)}
                    keyExtractor={(item, index) => index.toString()}
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
                <View tyle={{flex:1, flexDirection: 'column'}} >
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
        alignItems: 'center'
    },
    imagesContainer:{
        flex: 1,
    },
    backgroundImage: {
        height: 200,
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