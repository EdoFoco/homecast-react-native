export default class WSAdaptor{

    connected = false;
    webSocketUrl = '';
    wsConn = null;
   
    constructor(webSocketUrl, onConnect, onEvent, onError, onMessage ){
        this.webSocketUrl = webSocketUrl;
        this.onConnect = onConnect;
        this.onEvent = onEvent;
        this.onError = onError;
        this.onMessage = onMessage;
    }

    initialize(){
        this.wsConn = new WebSocket(this.webSocketUrl);
        
        this.wsConn.onopen = () => {
            this.connected = true;
            this.onConnect();
        }

        this.wsConn.onmessage = (event) => {
        	 this.onMessage(event);
        }
        
        this.wsConn.onerror = (error) => {
            console.log('Error connecting to WebRtc Server');
			this.onError(error)
        }
        
        this.wsConn.onclose = (data) => {
            console.log("connection closed.");

			this.connected = false;

			this.onEvent("closed", data);
		}
    }

    isConnected() {
        return this.connected;
    }

    send(text) {
        if (this.wsConn.readyState == 0 || this.wsConn.readyState == 2 || this.wsConn.readyState == 3) {
            this.onError("WebSocketNotConnected");
            return;
        }
        this.wsConn.send(text);
    }

    disconnect(){
        this.wsConn.close();
    }
}