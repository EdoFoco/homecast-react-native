import * as UserActions from './User';
import * as NavigatorActions from './Navigator';
import * as SectionActions from './Section';
import * as Chat from './Chat';
import * as Properties from './Properties';
import * as Viewings from './Viewings';
import * as ErrorHandler from './ErrorHandler';
import * as NavActions from './NavActions';
import * as Scrapers from './Scrapers';
import * as Location from './Location';
import * as Filters from './Filters';
import * as Network from './Network';

export const ActionCreators = Object.assign({},
  UserActions,
  NavigatorActions,
  SectionActions,
  Chat,
  Properties,
  ErrorHandler,
  Viewings,
  NavActions,
  Scrapers,
  Location,
  Filters,
  Network
);