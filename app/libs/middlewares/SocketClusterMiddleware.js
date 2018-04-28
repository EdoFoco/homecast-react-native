import * as types from './../../actions/Types';
import * as socketCluster from 'socketcluster-client';

//var options = { host: '35.176.192.208:8000' };
//var options = { host: '192.168.1.76:8000' };
var options = { host: 'ec2-34-245-44-121.eu-west-1.compute.amazonaws.com:8000' };
var socket;
var iceCounter = 0;
var poller;
export default function createSocketMiddleware(callsToServerPrefix = 'server/', callsToClientPrefix = 'client/') {

    return ({ dispatch }) => {

     return next => (action) => {
            if(action.type === types.SERVER_CONNECT){
                socket = socketCluster.connect(options);
                console.log('Creating new socket, ' + socket.id);

                socket.on('error', function (err) {
                    console.log(err);
                    return next({ type: types.SET_SOCKET_ERROR, data: { hasError: true, error: err }});
                });
            
                socket.on('connect', function(){
                    var room = socket.subscribe(action.data.roomId);

                    poller = setInterval(() => { 
                        socket.publish(action.data.roomId, { type: types.SERVER_ROOM_STATUS, data: { roomId: action.data.roomId }});
                     }, 3000);
                           

                    socket.on('subscribe', function(){
                        var subs = socket.subscriptions();
                        console.log('subscribed' + socket.id);
                        console.log(action.data.roomId);
                        socket.publish(action.data.roomId, {type: 'server/joinRoom', data: {socketId: socket.id, username: action.data.username, isPresenter: action.data.isPresenter, roomId: action.data.roomId} });
                        return next({ type: types.CLIENT_CONNECTED, data: { socketId: socket.id}})
                    });
                    
                    room.watch(function(event){
                        if(event.type.indexOf(callsToClientPrefix) > -1){
                            dispatch(event);
                        }
                        if(event.type === 'viewerResponse'){
                            dispatch(event);
                        }
                        if(event.type === 'presenterResponse'){
                            console.log('4. Got presenter response');
                            console.log(event);
                            dispatch(event);
                        }
                        if(event.type === 'iceCandidate'){
                            if(event.data.socketId === socket.id){
                                iceCounter++;
                                console.log('iceCandidate RECEIVED', iceCounter + ' ');
                                console.log(event);
                                dispatch(event);
                            }
                            
                        }
                    });
                
                    return next({ type: types.SET_SOCKET_ERROR, data: { hasError: false, error: null } });
                })
            }

            if(action.type === types.SERVER_DISCONNECT){
                console.log(action);
                iceCounter = 0;
                clearInterval(poller);
               //socket.publish(action.data.roomId, {type: 'server/disconnect', data: {socketId: socket.id} });
                if(socket){
                    socket.destroyChannel(action.data.roomId);
                    socket.disconnect();
                    socket.off('connect');
                    socket.off('subscribe');
                    socket.off('error');
                    socket = null;
                }

                return next(action);
            }
            
            
            if(socket && action.type && action.type.indexOf(callsToServerPrefix) > -1){
                socket.publish(action.data.roomId, action);
            }

            if(socket && (action.type === 'viewer' || action.type === 'presenter' || action.type === 'onIceCandidate')){
                console.log('sending on ice candidate');
                socket.publish(action.data.roomId, action);
            }
        
            return next(action);
           
        };
    }
}