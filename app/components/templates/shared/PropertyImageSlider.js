import React, { Component} from 'react';
import PropTypes from 'prop-types';
import PlaceholderFastImage from './PlaceholderFastImage';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';

export default class PropertyImageSlider extends Component {

    _renderImage = ({item}) => {
        let image = item;
        return(  
          <View style={{ width:  Dimensions.get('window').width }}>
            <PlaceholderFastImage
                style={styles.backgroundImage}
                source={{
                    uri: image ? image.url : '',
                    priority: FastImage.priority.normal,
                }}
            />
          </View>
        ) 
      }

    render(){
        return(
            <View style={{flexDirection: 'row', 'backgroundColor': 'black'}} >
                <FlatList
                    style={styles.imagesContainer}
                    data={this.props.images}
                    renderItem={(image) => this._renderImage(image)}
                    keyExtractor={(index) => index.toString()}
                    removeClippedSubviews={false}
                    horizontal
                    pagingEnabled
                />
            </View>
        )
    }
}

PropertyImageSlider.PropTypes = {
    images: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
    imagesContainer: {
        height: 250,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    backgroundImage: {
        height: 250,
    }
});