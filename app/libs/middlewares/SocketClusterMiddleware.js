import * as types from './../../actions/Types';
import * as socketCluster from 'socketcluster-client';

//var options = { host: 'localhost:8000' };
var options = { host: '192.168.1.76:8000' };


export default function createSocketMiddleware(callsToServerPrefix = 'server/', callsToClientPrefix = 'client/') {
    
    var socket;

    return ({ dispatch }) => {

     return next => (action) => {
            if(action.type === types.SERVER_CONNECT){
                console.log(action);
                socket = socketCluster.connect(options);
                
                socket.on('error', function (err) {
                    console.log(err);
                    return next({ type: types.SET_SOCKET_ERROR, data: { hasError: true, error: err }});
                });
            
                socket.on('connect', function(){
                    var room = socket.subscribe(action.data.roomId);

                    socket.on('subscribe', function(){
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
                        if(event.type === 'iceCandidate'){
                            dispatch(event);
                        }
                    });

                    return next({ type: types.SET_SOCKET_ERROR, data: { hasError: false, error: null } });
                })
            }

            if(action.type === types.SERVER_DISCONNECT){
                socket.disconnect({ roomId: action.data.roomId });
                socket = null;
                return next(action);
            }
            
            
            if(socket && action.type.indexOf(callsToServerPrefix) > -1){
                socket.publish(action.data.roomId, action);
            }

            if(socket && (action.type === 'viewer' || action.type === 'onIceCandidate')){
                socket.publish(action.data.roomId, action);
            }
        
            return next(action);
           
        };
    }
}