import Path from 'path-parser';
import { NavigationActions } from 'react-navigation';
import * as propertyActions from '../../actions/Properties';
import * as viewingActions from '../../actions/Viewings';
import * as chatActions from '../../actions/Chat';
import * as navActions from '../../actions/NavActions';

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

async function handleViewingDeepLink(store, params) {
  try{
    var properties = await store.dispatch(propertyActions.getProperties());
  
    var property = properties.find(p => p.id == params.propertyId);
    if(!property){
      throw new Error("Property not found");
    }
  
    var propertyViewing = property.viewings.find(v => v.id == params.viewingId);
    if(!propertyViewing){
        throw new Error('Viewing not found');
    };
  
    var viewing = await store.dispatch(viewingActions.getViewing(params.viewingId));
    
    await store.dispatch(navActions.goToPropertiesTab());
    await store.dispatch(navActions.goToPropertiesHome());
    await store.dispatch(navActions.goToPropertiesTabViewingsScreen(property, viewing.id));
  }
  catch(e){
    console.log(e);
  }
}

async function handleChatDeepLink(store, params){
  try{
    var chats = await store.dispatch(chatActions.getChats())
    var chat = chats.find(c => c.id == params.chatId);
    
    if(!chat){
      throw new Error('Chat not found');
    }
    
    await store.dispatch(navActions.goToChatsTab());
    await store.dispatch(navActions.goToChat(chat));
  }
  catch(e){
    console.log(e);
  }
  
}