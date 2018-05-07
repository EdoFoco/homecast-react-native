import Path from 'path-parser';
import { NavigationActions } from 'react-navigation';
import * as propertyActions from '../../actions/Properties';
import * as viewingActions from '../../actions/Viewings';
import * as chatActions from '../../actions/Chat';
import * as navActions from '../../actions/NavActions';
import store from '../../reducers';

const paths = [
  {
    routeName: 'ViewingScreen',
    path: new Path('/guest/properties/:propertyId/viewings/:viewingId')
  },
  {
    routeName: 'ChatScreen',
    path: new Path('/chats/:chatId')
  }
];

const findPath = url => paths.find(path => path.path.test(url));

export default function (store, url) {
  const pathObject = findPath(url);
  
  if (!pathObject) return;

  var params = pathObject.path.test(url);
  switch(pathObject.routeName){
    case 'ViewingScreen':
        handleViewingDeepLink(store, params);
        break;
    case 'ChatScreen':
        handleChatDeepLink(store, params);
    default:
        break;
  }
  
};

function handleViewingDeepLink(store, params) {
  store.dispatch(propertyActions.getProperties())
  .then((properties) => {
      var property = properties.find(p => p.id == params.propertyId);
      var propertyViewing = property.viewings.find(v => v.id == params.viewingId);
      if(!propertyViewing){
          throw new Error('Viewing not found');
      }
      if(property){
        return store.dispatch(viewingActions.getViewing(params.viewingId))
        .then((viewing) => {
            return data = {
                property: property,
                viewing: viewing
            }
        });
      }

      throw new Error("Property not found");
  })
  .then((data) => {
    store.dispatch(navActions.goToPropertiesTab());
    return data;
  })
  .then((data) => {
    return store.dispatch(navActions.goToPropertiesTabViewingsScreen(data.property, data.viewing.id));
  })
  .catch((e) => {
      console.log(e);
  });
}

function handleChatDeepLink(store, params){
  console.log('handling deep link');
  console.log(params);
  store.dispatch(chatActions.getChats())
  .then((chats) => {
    console.log(chats);
    var chat = chats.find(c => c.id == params.chatId);
    console.log(chat);

    if(!chat){
      throw new Error('Chat not found');
    }
    return chat;
  })
  .then((chat) => {
     store.dispatch(navActions.goToChatsTab());
     return chat;
  })
  .then((chat) => {
    return store.dispatch(navActions.goToChat(chat));
  })
  .catch((error) => {
    console.log(error);
  })
}