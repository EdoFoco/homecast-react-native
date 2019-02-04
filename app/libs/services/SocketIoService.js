import SocketIOClient from 'socket.io-client';
import * as Status from './SocketStatus';
import * as SocketCommands from './SocketCommands';

export default class SocketIoService {
  
   constructor(onChangeStatus, onMessageReceived){
        this.socket = SocketIOClient('http://192.168.43.245:3000', 
        {
            'reconnection': true,
            'reconnectionDelay': 500,
            'reconnectionAttempts': 4
        });

        this.onChangeStatus = onChangeStatus;
        this.onMessageReceived = onMessageReceived;

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
            console.log('Stream Added: ', JSON.parse(data));
        });

        this.socket.on(SocketCommands.ON_PARTICIPANT_JOINED, (data) => {
            console.log('Participant Joined: ', JSON.parse(data));
        });

        this.socket.on(SocketCommands.ON_PARTICIPANT_LEFT, (data) => {
            console.log('Participant Left: ', JSON.parse(data));
        });

        this.socket.on(SocketCommands.ON_STREAM_REMOVED, (data) => {
            console.log('Stream Removed: ', JSON.parse(data));
        });

        this.socket.on(SocketCommands.ON_ROOM_DETAILS, (data) => {
            console.log('Room Details: ', JSON.parse(data));
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
