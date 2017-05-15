import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppReducer from './app/reducers';
import AppWithNavigationState from './app/navigators/AppNavigator';
import thunk from 'redux-thunk';


class ReduxExampleApp extends React.Component {
  store = createStore(AppReducer,  applyMiddleware(thunk));

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('NavTestV1', () => ReduxExampleApp);

export default ReduxExampleApp;
