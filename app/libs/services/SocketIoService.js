import SocketIOClient from 'socket.io-client';

export default class SocketIoService {
  
   constructor(onConnection, onMessageReceived){
        this.socket = SocketIOClient('http://localhost:3000');
       
        this.onConnection = onConnection;
        this.onMessageReceived = onMessageReceived;

        this.socket.on('connect', () => {
            this.onConnection();
        });

        this.socket.on('new message', (data) => {
            console.log('New Message', message);
        });
   }

   joinRoom(room, user){
        var data = {
           room: room,
           user: user
        };
       
        this.socket.emit('join room', JSON.stringify(data));
   }

   sendMessage(user, message){
        var data = {
            user: user,
            message: message
        };

        this.socket.emit('new message', message)
   }


}
