import * as types from './Types';
//import WebRTCClient from '../libs/services/WebRTCClient';


export function updateConnectionStatus(status){
    return {
        type: types.UPDATE_CONNECTION_STATUS,
        status: status
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

export function receiveText( sender, data ){
    return {
        type: types.UPDATE_TEXT_ROOM_DATA,
        textRoomData: data
    }
}
/*
export function sendText( textRoomData, message ){
    WebRTCClient.sendText(message);

    return {
        type: types.UPDATE_TEXT_ROOM_DATA,
        textRoomData: textRoomData
    }
}*/

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

export function setTextRoomState( textRoomConnected ){
    return {
        type: types.SET_TEXT_ROOM_CONNECTED_STATE,
        textRoomConnected: textRoomConnected
    }
}

export function removePeer( peerId ){
    return {
        type: types.REMOVE_PEER,
        peerId: peerId
    }
}
/*
export function initWebRTC(){
    return (dispatch, getState) => {
        dispatch(rtcClient.initSocket());
    };
}
*/

//Kurento
export function startViewer(data){
    return {
        type: 'viewer',
        data: data
    }
}

export function startPresenter(data){
    return {
        type: 'presenter',
        data: data
    }
}

export function sendOnIceCandidate(data){
    return {
        type: 'onIceCandidate',
        data: data
    }
}

export function updateStreamUrl(url){
    return {
        type: 'updateStreamUrl',
        url: url
    }
}

