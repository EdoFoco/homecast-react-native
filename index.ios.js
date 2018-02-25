import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppReducer from './app/reducers';
import AppWithNavigationState from './app/navigators/AppNavigator';
import MainScreen from './app/components/templates/MainScreen';
import thunk from 'redux-thunk';
import io from 'socket.io-client';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import storage from 'redux-persist/lib/storage';
import createSocketMiddleware from './app/libs/middlewares/SocketClusterMiddleware';

let socketIoMiddleware = createSocketMiddleware();

const persistConfig = {
  key: 'root',
  storage,
}

class ReduxExampleApp extends React.Component {
  
  persistedReducer = persistReducer(persistConfig, AppReducer)
  store = createStore(this.persistedReducer,  applyMiddleware( socketIoMiddleware, thunk));
  persistor = persistStore(this.store)

  render() {

    return (
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor}>
          <MainScreen />
        </PersistGate>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('NavTestV1', () => ReduxExampleApp);

export default ReduxExampleApp;
