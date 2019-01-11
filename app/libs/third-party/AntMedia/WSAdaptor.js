//import * as socketCluster from 'socketcluster-client';

export default class WSAdaptor{

    connected = false;
    webSocketUrl = '';
    wsConn = null;
    debug = true;
    callback = () => {console.log('WSAdaptor: Callback not defined')};
    callbackError = () => {console.log('WSAdaptor: CallbackError not defined')};
    onMessage = () => {console.log('WSAdaptor: OnMessage not defined')};

    constructor(webSocketUrl, callback, callbackError, onMessage ){
        this.webSocketUrl = webSocketUrl;
        this.callback = callback;
        this.callbackError = callbackError;
        this.onMessage = onMessage;
    }

    initialize(){
        console.log("Initializing WSAdaptor");
        console.log(this.webSocketUrl);
        try{
            this.wsConn = new WebSocket(this.webSocketUrl);
            console.log(this.wsConn);
        }
        catch(e){
            console.log(e);
        }
        
        this.wsConn.onopen = () => {
            console.log('Connected');
            if (this.debug) {
                console.log("websocket connected");
            }

            this.connected = true;
            this.callback("initialized");
        }

        this.wsConn.onmessage = (event) => {
            // console.log('Message received');
            // console.log(event);
			 this.onMessage(event);
        }
        
        this.wsConn.onerror = (error) => {
            console.log('Error occured');
			console.log(" error occured: " + JSON.stringify(error));
			this.callbackError(error)
        }
        
        this.wsConn.onclose = (event) => {
            console.log("connection closed.");

			this.connected = false;

			this.callback("closed", event);
		}
    }

    isConnected() {
        return this.connected;
    }

    send(text) {
        if (this.wsConn.readyState == 0 || this.wsConn.readyState == 2 || this.wsConn.readyState == 3) {
            this.callbackError("WebSocketNotConnected");
            return;
        }
        this.wsConn.send(text);
        console.log("sent message:" +text);
    }
}