import SocketIOClient from 'socket.io-client';
import * as Status from './SocketStatus';
import * as SocketCommands from './SocketCommands';
import * as Config from '../../config';

export default class SocketIoService {
  
   constructor(onChangeStatus, onMessageReceived, onRoomEvent){
        this.socket = SocketIOClient(Config.SOCKET_SERVICE_URL, 
        {
            'reconnection': true,
            'reconnectionDelay': 500,
            'reconnectionAttempts': 4
        });

        this.onChangeStatus = onChangeStatus;
        this.onMessageReceived = onMessageReceived;
        this.onRoomEvent = onRoomEvent;

        this.socket.on(SocketCommands.ON_CONNECT, () => {
            this.onChangeStatus(Status.CONNECTED);
        });

        this.socket.on(SocketCommands.ON_RECONNECT, () => {
            this.onChangeStatus(Status.CONNECTED);
        })

        this.socket.on(SocketCommands.ON_MESSAGE_SENT, (data) => {
            console.log('Message Sent: ', JSON.parse(data));
        });

        this.socket.on(SocketCommands.ON_RECONNECTING, () => {
            this.onChangeStatus(Status.RECONNECTING);
        });

        this.socket.on(SocketCommands.ON_RECONNECT_FAILED, () => {
            this.onChangeStatus(Status.ERROR_CONNECTING);
        });

        this.socket.on(SocketCommands.ON_CONNECTION_TIMEOUT, () => {
            this.onChangeStatus(Status.ERROR_CONNECTING);
        });

        this.socket.on(SocketCommands.ON_STREAM_ADDED, (data) => {
            this.onRoomEvent(SocketCommands.ON_STREAM_ADDED, data);
        });

        this.socket.on(SocketCommands.ON_PARTICIPANT_JOINED, (data) => {
            this.onRoomEvent(SocketCommands.ON_PARTICIPANT_JOINED, data);
        });

        this.socket.on(SocketCommands.ON_PARTICIPANT_LEFT, (data) => {
            this.onRoomEvent(SocketCommands.ON_PARTICIPANT_LEFT, data);
        });

        this.socket.on(SocketCommands.ON_STREAM_REMOVED, (data) => {
            this.onRoomEvent(SocketCommands.ON_STREAM_REMOVED, data);
        });

        this.socket.on(SocketCommands.ON_ROOM_DETAILS, (data) => {
            this.onRoomEvent(SocketCommands.ON_ROOM_DETAILS, data);
        });

        this.socket.on(SocketCommands.ON_ROOM_JOINED, (data) => {
            this.onRoomEvent(SocketCommands.ON_ROOM_JOINED);
        });
        
        this.socket.on(SocketCommands.ON_STREAM_ADDED, (data) => {
            this.onRoomEvent(SocketCommands.ON_STREAM_ADDED, data);
        });
   }

   joinRoom(room, user){
        var data = {
           room: room,
           user: user
        };
       
        this.socket.emit(SocketCommands.JOIN_ROOM, JSON.stringify(data));
   }

   sendMessage(user, message){
        var data = {
            user: user,
            message: message
        };

        this.socket.emit(SocketCommands.SEND_MESSAGE, JSON.stringify(data))
   }

   addStream(user, streamId){
       var data = {
           user: user,
           streamId: streamId
       }

       this.socket.emit(SocketCommands.ADD_STREAM, JSON.stringify(data))
   }

    removeStream(user, streamId){
        var data = {
            user: user,
            streamId: streamId
        }

        this.socket.emit(SocketCommands.REMOVE_STREAM, JSON.stringify(data))
    }

    getRoomDetails(user){
        var data = {
            user: user
        }
 
        this.socket.emit(SocketCommands.GET_ROOM_DETAILS, JSON.stringify(data))
    }

    disconnect(){
        this.socket.disconnect();
    }
}
