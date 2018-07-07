import * as socketCluster from 'socketcluster-client';
import * as types from '../../actions/Types';
//var options = { host: '35.176.192.208:8000' };
//var options = { host: 'localhost:8000' };


var options = { host: 'ec2-34-245-44-121.eu-west-1.compute.amazonaws.com:8000' };
var socket;
var iceCounter = 0;
var poller;
var room;

class SocketService {
  
    static instance = SocketService.instance == null ? new SocketService() : this.instance
    
    connect(connectionData, onError, onSubscribed, onRoomStatus){
        try{
            socket = socketCluster.connect(options);
            console.log('Creating new socket, ' + socket.id);
    
            socket.on('error', function (err) {
                console.log(err);
                this.kill();
                onError(err);
            }.bind(this));

            socket.on('connect', function(){
                this.onConnect(connectionData, onSubscribed, onRoomStatus);
            }.bind(this));
        }
        catch(e){
            console.log(e);
        }
    }

    onConnect(connectionData, onSubscribed, onRoomStatus) {
        room = socket.subscribe(connectionData.roomId);
                
        socket.on('subscribe', function(){
            console.log('subscribed' + socket.id);
            console.log(connectionData.roomId);
            socket.publish(connectionData.roomId, {type: 'server/joinRoom', data: {socketId: socket.id, username: connectionData.username, isPresenter: connectionData.isPresenter, roomId: connectionData.roomId} });
            onSubscribed(socket.id);

        }.bind(this));
        
        this.startPoller(connectionData);

        room.watch(function(event){
            
            if(event.type === 'client/roomStatus'){
                onRoomStatus(action.data);
            }
        });
    }

   
    startPoller(connectionData){
        poller = setInterval(() => { 
            if(!socket)
                clearInterval(poller);
            socket.publish(connectionData.roomId, { type: types.SERVER_ROOM_STATUS, data: { roomId: connectionData.roomId }});
        }, 3000);
    }

   

    kill(){
        clearInterval(poller);
        //socket.publish(action.data.roomId, {type: 'server/disconnect', data: {socketId: socket.id} });
         if(socket){
           //  socket.destroyChannel(action.data.roomId);
           socket.disconnect();
           socket.off('connect');
           socket.off('subscribe');
           socket.off('error');
           socket = null;
         }

         this.instance = null;
    }
   
}

export default SocketService;
