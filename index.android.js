import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppReducer from './app/reducers';
import AppWithNavigationState from './app/navigators/AppNavigator';
import MainScreen from './app/components/templates/MainScreen';
import thunk from 'redux-thunk';
import io from 'socket.io-client';

//import createSocketIoMiddleware from './app/libs/middlewares/SocketIOMiddleware';
import createSocketMiddleware from './app/libs/middlewares/SocketClusterMiddleware';

//let socket = io('http://localhost:3000');
let socketIoMiddleware = createSocketMiddleware();

class ReduxExampleApp extends React.Component {
  
  
  store = createStore(AppReducer,  applyMiddleware( socketIoMiddleware, thunk));

  render() {

    return (
      <Provider store={this.store}>
        <MainScreen />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Homecast', () => ReduxExampleApp);

export default ReduxExampleApp;
