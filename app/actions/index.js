import * as AuthActions from './Auth';
import * as NavigatorActions from './Navigator';
import * as SectionActions from './Section';
import * as WebRTC from './WebRTC';
import * as Chat from './Chat';
import * as Properties from './Properties';

export const ActionCreators = Object.assign({},
  AuthActions,
  NavigatorActions,
  SectionActions,
  WebRTC,
  Chat,
  Properties
);