import * as UserActions from './User';
import * as NavigatorActions from './Navigator';
import * as SectionActions from './Section';
import * as WebRTC from './WebRTC';
import * as Chat from './Chat';
import * as Properties from './Properties';
import * as Viewings from './Viewings';
import * as PropertyScreen from './PropertyScreen';
import * as ErrorHandler from './ErrorHandler';
import * as NavActions from './NavActions';
import * as Scrapers from './Scrapers';

export const ActionCreators = Object.assign({},
  UserActions,
  NavigatorActions,
  SectionActions,
  WebRTC,
  Chat,
  Properties,
  PropertyScreen,
  ErrorHandler,
  Viewings,
  NavActions,
  Scrapers
);