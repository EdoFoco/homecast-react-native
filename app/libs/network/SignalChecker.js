import { NetInfo } from 'react-native';
import * as networkActions from '../../actions/Network';
import GAClient from '../../libs/third-party/GoogleAnalytics/ga';

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
              GAClient.gaClientInstance.trackSignalStrength(connectionInfo.type, connectionInfo.effectiveType);
              store.dispatch(networkActions.updateSignalStrength(connectionInfo.type, connectionInfo.effectiveType));
            }
           );
    }
}

export default SignalChecker