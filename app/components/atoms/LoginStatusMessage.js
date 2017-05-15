import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  errorMessage: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'red'
  }
});

const LoginStatusMessage = ({ isLoggedIn, user, error, dispatch }) => {
  if (!isLoggedIn) {
    if(error){
      return <View>
        <Text style={styles.errorMessage}>{ error.message }</Text>
      </View>;
    }
    return <Text></Text>;
  }
  return (
    <View>
      <Text style={styles.welcome}>
        {'Hi ' + user.name +'! You are "logged in"'}
      </Text>
      <Button
        onPress={() => dispatch(NavigationActions.navigate({ routeName: 'Profile' }))}
        title="Profile"
      />
    </View>
  );
};

LoginStatusMessage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  user: state.user.user,
  error: state.user.error
});

export default connect(mapStateToProps)(LoginStatusMessage);
