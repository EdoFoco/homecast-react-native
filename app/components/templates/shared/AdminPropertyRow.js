import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PlaceholderFastImage from './PlaceholderFastImage';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View} from 'react-native';

export default class AdminPropertyRow extends Component{
    render(){
        return(<TouchableHighlight onPress={() => {this.props.onPress()}}>
          <View style={styles.listingCell}>
            <PlaceholderFastImage style={styles.listingImage} source={{url: this.props.property.images.length > 0 ? this.props.property.images[0].url : ''}}/>
            <View style={styles.listingDescription}>
              <Text style={styles.listingTitle}>{this.props.property.address.replace(', UK', '')}</Text>
              {
                this.props.property.listing_active ? 
                <Text style={styles.active}>
                  <Icon name="check-circle" style={styles.activeIcon} />
                     Active
                </Text> :
                <Text style={styles.active}>
                  <Icon name="check-circle" style={styles.inactiveIcon} />
                  Inactive
                </Text> 
              }
            </View>
          </View>
        </TouchableHighlight>
        )
    }
}

AdminPropertyRow.PropTypes = {
    onPress:  PropTypes.func.isRequired,
    property: PropTypes.object.isRequired
}
  
var styles = StyleSheet.create({
    listingCell: {
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: Colors.WHITE_SMOKE,
        paddingTop: 5,
        paddingBottom: 5
      },
      listingDescription: {
        flex: 1,
        margin: 10
      },
      listingImage: {
        height: 100,
        width: 150,
        margin: 5,
        borderRadius: 5,
      },
      listingTitle: {
        fontSize: FontSizes.DEFAULT
      },
      active: {
        marginTop: 5,
        color: Colors.LIGHT_GRAY,
        fontSize: FontSizes.DEFAULT,
        justifyContent: 'center'
      },
      activeIcon: {
        fontSize: 20,
        color: Colors.AQUA_GREEN
      },
      inactiveIcon: {
        fontSize: 20,
        color: Colors.LIGHT_GRAY
      },
});