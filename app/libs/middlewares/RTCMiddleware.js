import * as types from './../../actions/Types';

export default function createRTCMiddleware() {
    
    return ({ dispatch }) => {
        
        return next => (action) => {
            
            if(action.type === types.SERVER_JOIN_ROOM){
                socket = io('http://localhost:3000');
                emitBound = socket.emit.bind(socket);

                // Wire socket.io to dispatch actions sent by the server.
                socket.on(eventName, dispatch);
            }
            return next(action);
        };
    }
}