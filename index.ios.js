import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppReducer from './app/reducers';
//import AppWithNavigationState from './app/navigators/AppNavigator';
import MainScreen from './app/components/templates/MainScreen';
import thunk from 'redux-thunk';
import io from 'socket.io-client';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import storage from 'redux-persist/lib/storage';
import createSocketMiddleware from './app/libs/middlewares/SocketClusterMiddleware';
import {Linking} from 'react-native';
import LinkRoutes from './app/libs/routing/LinkRoutes';
import firebase, { RemoteMessage, NotificationOpen } from 'react-native-firebase';
import * as chatActions from './app/actions/Chat';

import reduxCatch from 'redux-catch';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

let socketIoMiddleware = createSocketMiddleware();
let navMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);
const addListener = createReduxBoundAddListener("root");

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['webrtc', 'network', 'location']
};

class ReduxExampleApp extends React.Component {
  
 
  persistedReducer = persistReducer(persistConfig, AppReducer)
  store = createStore(this.persistedReducer,  applyMiddleware(reduxCatch(this.handleError), navMiddleware, socketIoMiddleware, thunk));
  persistor = persistStore(this.store)

  componentDidMount() {
    Linking.addEventListener('url', event => this.handleOpenURL(event.url));
    Linking.getInitialURL().then(url => url && this.handleOpenURL(url));

    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
      console.log(notification);
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        this.store.dispatch(chatActions.getChats());
    });

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const action = notificationOpen.action;
      const notification = notificationOpen.notification;
      console.log(notification);
      if(notification.data && notification.data.path){
        this.handleOpenURL(notification.data.path);
      }
    });
  }

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
}

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL(url) {
    const path = url.split(':/')[1];
    LinkRoutes(this.store, path);
  }

  handleError(error, getState, lastAction, dispatch) {
    console.error(error);
    console.debug('Handling Redux');
    console.debug('current state', getState());
    console.debug('last action was', lastAction);
    // optionally dispatch an action due to the error using the dispatch parameter
  }
  
  
  render() {

    return (
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor}>
          <MainScreen addListener={addListener}/>
        </PersistGate>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('NavTestV1', () => ReduxExampleApp);

export default ReduxExampleApp;
