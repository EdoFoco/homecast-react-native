import React from 'react';
import { AppRegistry, Alert, Text, TextInput, View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppReducer from './app/reducers';
import MainScreen from './app/components/templates/MainScreen';
import thunk from 'redux-thunk';
import * as Colors from './app/components/helpers/ColorPallette';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import storage from 'redux-persist/lib/storage';
import {Linking} from 'react-native';
import LinkRoutes from './app/libs/routing/LinkRoutes';
import SignalChecker from './app/libs/network/SignalChecker';
import firebase from 'react-native-firebase';
import * as chatActions from './app/actions/Chat';
import * as errorHandlerActions from './app/actions/ErrorHandler';
import { AsyncStorage } from 'react-native';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import GAClient from './app/libs/third-party/GoogleAnalytics/ga';
import reduxCatch from 'redux-catch';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

let navMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);
const addListener = createReduxBoundAddListener("root");

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: [ 'network', 'location', 'viewingsNav']
};

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    Alert.alert(
        'Unexpected error occurred',
        `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
        We have reported this to our team ! Please close the app and start again!
        `,
      [{
        text: 'Close'
      }]
    );
    AsyncStorage.getAllKeys()
    .then((keys) => {
      AsyncStorage.multiRemove(keys);
    })
    .catch((e) => {
      console.debug(e);
    });
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
  if(e){
    GAClient.gaClientInstance.trackException(e.message, isFatal);
  }
};

setJSExceptionHandler(errorHandler, true);

setNativeExceptionHandler((errorString) => {
    console.log('setNativeExceptionHandler');
    GAClient.gaClientInstance.trackException(errorString, isFatal);
});

class HomecastApp extends React.Component {
  
  persistedReducer = persistReducer(persistConfig, AppReducer)
  store = createStore(this.persistedReducer,  applyMiddleware(reduxCatch(this.handleError), navMiddleware, thunk));
  persistor = persistStore(this.store)

  componentDidMount() {
    this.setDefaultFontFamily();
    Linking.addEventListener('url', event => this.handleOpenURL(event.url));
    Linking.getInitialURL().then(url => url && this.handleOpenURL(url));
    SignalChecker.listenForSignalChange(this.store);

    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
      console.log(notification);
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    this.notificationListener = firebase.notifications().onNotification(() => {
      this.store.dispatch(chatActions.getChats());
    });

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
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
    Linking.removeEventListener('url', this.handleOpenURL);
}

  handleOpenURL(url) {
    const path = url.split(':/')[1];
    LinkRoutes(this.store, path);
  }

  handleError(error, getState, lastAction, dispatch) {
    dispatch(errorHandlerActions.resetReducers());
    AsyncStorage.getAllKeys()
    .then((keys) => {
      AsyncStorage.multiRemove(keys);
    })
    .catch((e) => {
      console.debug(e);
    });
  }
  
  
  setDefaultFontFamily() {
    let components = [Text, TextInput]

    const customProps = {
        style: {
            fontFamily: "Avenir-Book"
        }
    }

    for(let i = 0; i < components.length; i++) {
        const TextRender = components[i].prototype.render;
        const initialDefaultProps = components[i].prototype.constructor.defaultProps;
        components[i].prototype.constructor.defaultProps = {
            ...initialDefaultProps,
            ...customProps,
        }
        components[i].prototype.render = function render() {
            let oldProps = this.props;
            this.props = { ...this.props, style: [customProps.style, this.props.style] };
            try {
                return TextRender.apply(this, arguments);
            } finally {
                this.props = oldProps;
            }
        };
    }
  }

  render() {

    return (
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor}>
          <View style={{flex: 1}}>
           <StatusBar
              backgroundColor="blue"
              barStyle="light-content"
            />
            <MainScreen addListener={addListener}/>
          </View>
        </PersistGate>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Homecast', () => HomecastApp);

export default HomecastApp;
