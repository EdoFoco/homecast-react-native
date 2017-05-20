import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

const ViewingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.welcome}>
      Viewings Screen
    </Text>
  </View>
);

ViewingsScreen.navigationOptions = {
  title: 'Viewings Screen',
};

export default ViewingsScreen;