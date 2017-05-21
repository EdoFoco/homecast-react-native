import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import GuestTabBar from '../../navigators/GuestTabBarNavigator';


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

const ProfileScreen = () => (
  //<GuestTabBar />
  <View style={styles.container}>
    <Text style={styles.welcome}>
      Profile Screen
    </Text>
  </View>
);

ProfileScreen.navigationOptions = {
  title: 'Profile',
};

export default ProfileScreen;
