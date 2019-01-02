import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import resolveAssetSource from 'resolveAssetSource';
export default class PlaceHolderFastImage extends Component {
  constructor(props){
    super(props)

    this.state = {
      loaded: false,
      style: StyleSheet.flatten(props.style)
    }
  }

  onLoadEnd(){
    this.setState({loaded: true});
  }

  render() {
    let img = resolveAssetSource(require('../../../img/property_placeholder.jpg'));
    img.width = this.props.style.width;
    img.height = this.props.style.height;

    let source = img;
    if(this.props.source.uri && this.props.source.uri != ""){
      source = this.props.source;
    }

    return <View style={[this.props.style]}>
      {
        this.state.loaded ? null :
          <FastImage 
            source={img}
            style={this.props.style}
            resizeMode={FastImage.resizeMode.cover}
          />
       }
      <FastImage 
        source={source}
        style={this.props.style}
        onLoadEnd={() => {this.onLoadEnd() }}
        resizeMode={this.props.resizeMode ? this.props.resizeMode : FastImage.resizeMode.cover}
      />
    </View>
  }
}