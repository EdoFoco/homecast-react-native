import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator
  } from 'react-native-indicators';


export default class Spinner extends Component{
    
    render() {
      return (
              <View style={{height: 100, width: 100}}>
                  <PulseIndicator color='blue' size={100} color={'rgba(38,166,154, 0.8)'}/>
              </View>
      )
  }
}
