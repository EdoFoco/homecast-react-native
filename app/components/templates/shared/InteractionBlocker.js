import {View, StyleSheet} from 'react-native'
import React, { Component} from 'react';

export default class InteractionBlocker extends Component{

    render(){
        return <View style={styles.transparentLayer}></View>
    }
}

const styles = StyleSheet.create({
    transparentLayer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)'
    }
});
