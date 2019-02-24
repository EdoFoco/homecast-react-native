import React, { Component} from 'react';
import { MaterialIndicator  } from 'react-native-indicators';
import { View, StyleSheet } from 'react-native';
import * as Colors from '../../helpers/ColorPallette';
export default class FullScreenLoader extends Component{

    render(){
        return(
            <View style={styles.container}>
                <MaterialIndicator style={{marginBottom: 100 }}color={Colors.AQUA_GREEN} size={50} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});