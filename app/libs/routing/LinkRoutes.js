import Path from 'path-parser';
import { NavigationActions } from 'react-navigation';
import * as propertyActions from '../../actions/Properties';
import * as viewingActions from '../../actions/Viewings';
import * as navActions from '../../actions/NavActions';
import store from '../../reducers';

const paths = [
  {
    routeName: 'ViewingScreen',
    path: new Path('/guest/properties/:propertyId/viewings/:viewingId')
  },
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