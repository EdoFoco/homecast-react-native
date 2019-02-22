// import {
//     GoogleAnalyticsTracker,
//     GoogleAnalyticsSettings
//   } from "react-native-google-analytics-bridge";
  
class GAClient {
  
    //static gaClientInstance = GAClient.gaClientInstance == null ? new GAClient() : this.gaClientInstance
    tracker;

    constructor(){
       //this.tracker = new GoogleAnalyticsTracker("UA-121331072-1");
    }

    trackScreen(screenName){
        //this.tracker.trackScreenView(screenName);
    }

    trackClientViewingStarted(userId, viewingId){
        // this.tracker.trackEvent('ClientLiveStream', 'Viewing Started', {
        //     label: `Viewing:${viewingId}, User: ${userId}, Date: ${(new Date()).toString()}`,
        //     value: 1
        // });
    }

    trackSignalStrength(type, strength){
        // this.tracker.trackEvent('Network', 'NetworkChanged', {
        //     label: `Network Type:${type}, Strength: ${strength}, Date: ${(new Date()).toString()}`,
        //     value: 1
        // });
    }

    trackSignup(){
        //this.tracker.trackEvent('User', 'Signup');
    }

    trackLogin(userId){
        // this.tracker.trackEvent('User', 'Login', {
        //     label: `User: ${userId}`,
        //     value: 1
        // });
    }

    trackLocationFilter(location){
        // this.tracker.trackEvent('Filter', 'Location', {
        //     label: location,
        //     value: 1
        // })
    }

    trackException(e, isFatal){
        //this.tracker.trackException(e, isFatal);
    }
}

export default GAClient;
