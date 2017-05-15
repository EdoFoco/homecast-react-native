import React from 'react';
import { StyleSheet, View } from 'react-native';

import AuthContainer from '../organisms/AuthContainer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const MainScreen = () => (
  <View style={styles.container}>
    <AuthContainer />
  </View>
);

MainScreen.navigationOptions = {
  title: 'Home Screen',
};

export default MainScreen;
