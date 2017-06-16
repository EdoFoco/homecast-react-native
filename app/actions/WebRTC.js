import * as types from './Types';

export function updateConnectionStatus(status, info){
    return {
        type: types.UPDATE_CONNECTION_STATUS,
        status: status,
        info: info
    }
}

export function switchCamera( isFrontCamera ){
    return {
        type: types.SWITCH_CAMERA,
        isFrontCamera: isFrontCamera
    }
}

export function setVideoSource( videoSrc ){
    console.log(videoSrc);
    console.log('Video Source');
    return {
        type: types.SET_VIDEO_SOURCE,
        videoSrc: videoSrc
    }
}

export function receiveText( textRoomData ){
    return {
        type: types.UPDATE_TEXT_ROOM_DATA,
        textRoomData: textRoomData
    }
}

export function sendText( textRoomData ){
    return {
        type: types.UPDATE_TEXT_ROOM_DATA,
        textRoomData: textRoomData
    }
}

export function updateInfo( info ){
    return {
        type: types.UPDATE_INFO,
        info: info
    }
}

export function updateChannelList( remoteList ){
    return {
        type: types.UPDATE_CHANNEL_LIST,
        remoteList: remoteList
    }
}

export function setConnectedState( textRoomConnected ){
    return {
        type: types.SET_CONNECTED_STATE,
        remoteList: textRoomConnected
    }
}


export function setRoom( textRoomValue ){
    return {
        type: types.SET_ROOM,
        textRoomValue: textRoomValue
    }
}

export function setRoomId( roomID ){
    return {
        type: types.SET_ROOM_ID,
        roomID: roomID
    }
}
