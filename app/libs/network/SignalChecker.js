import { NetInfo } from 'react-native';
import * as networkActions from '../../actions/Network';
//import store from '../../reducers';

class SignalChecker {
  
    static listenForSignalChange(store){
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
          });
          function handleFirstConnectivityChange(connectionInfo) {
            console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
            NetInfo.removeEventListener(
              'connectionChange',
              handleFirstConnectivityChange
            );
          }
          NetInfo.addEventListener(
            'connectionChange', (connectionInfo) => {
              console.log('Connection, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
              store.dispatch(networkActions.updateSignalStrength(connectionInfo.effectiveType));
            }
           );
    }
}

export default SignalChecker