import * as UserActions from './User';
import * as NavigatorActions from './Navigator';
import * as SectionActions from './Section';
import * as WebRTC from './WebRTC';
import * as Chat from './Chat';
import * as Properties from './Properties';
import * as PropertyScreen from './PropertyScreen';
import * as ErrorHandler from './ErrorHandler';

export const ActionCreators = Object.assign({},
  //AuthActions,
  UserActions,
  NavigatorActions,
  SectionActions,
  WebRTC,
  Chat,
  Properties,
  PropertyScreen,
  ErrorHandler
);