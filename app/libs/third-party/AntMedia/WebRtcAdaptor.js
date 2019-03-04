import WSAdaptor from './WSAdaptor';
import * as Config from '../../../config';
import {
	RTCIceCandidate,
	RTCPeerConnection,
	RTCSessionDescription,
	MediaStreamTrack,
	mediaDevices
  } from 'react-native-webrtc';

var thiz;

export default class WebRTCAdaptor
{
	constructor(config){
		thiz = this;
		//thiz.websocketUrl = 'ws://ec2-3-8-201-4.eu-west-2.compute.amazonaws.com:5080/WebRTCAppEE/websocket',
		thiz.websocketUrl = Config.MEDIA_SERVER_URL,

		thiz.peerconnection_config = null;
		thiz.mediaConstraints = config.mediaConstraints,
		thiz.sdp_constraints = null;
		thiz.remotePeerConnection = new Array();
		thiz.webSocketAdaptor = null;
		thiz.roomName = null;
		thiz.videoTrackSender = null; //Check both of these if they're needed up here - they are not referened
		thiz.audioTrackSender = null;
		thiz.playStreamId = new Array();
		thiz.micGainNode = null;
		thiz.onError = config.onError;
		thiz.onConnect = config.onConnect;
		thiz.onEvent = config.onEvent;
		thiz.isPlayMode = false;
		thiz.setRemoteSource = config.setRemoteSource;
		thiz.remoteStream = config.remoteStream;
		thiz.debug = true;
	
		for(var key in config) {
			if(config.hasOwnProperty(key)) {
				thiz[key] = config[key];
			}
		}

		thiz.webSocketAdaptor = new WSAdaptor(thiz.websocketUrl, () => { thiz.onConnect() }, (event, data) => { thiz.onEvent(event, data)}, thiz.onError, (event) => { this.onMessageReceived(event)});
		thiz.webSocketAdaptor.initialize();
	}
	
	startMedia()
	{
		return this.getMedia()
		.then((stream) => {
			return this.gotStream(stream);
		});
	}

	/**
	 * Get user media
	 */
	getMedia() {
		var isFront = true;
		return mediaDevices.enumerateDevices()
		.then(sourceInfos => {
			console.log(sourceInfos);
			let videoSourceId;
			for (let i = 0; i < sourceInfos.length; i++) {
				const sourceInfo = sourceInfos[i];
				if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
					videoSourceId = sourceInfo.id;
				}
			}
			return mediaDevices.getUserMedia({
				audio: true,
				video: {
					mandatory: {
					  width: { min: 480, ideal: 720, max: 1080 },
					  height: { min: 640, ideal: 1280, max: 1920 },
					  minFrameRate: 30
					},			
				//   facingMode: (isFront ? "user" : "environment"),
				   optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
				}
			});
	});
}

	/**
	 * Closes stream, if you want to stop peer connection, call stop(streamId)
	 */
	closeStream(streamId) {
		
		thiz.localStream.getVideoTracks().forEach((track) => {
			track.onended = null;
            track.stop();
        });
		
		thiz.localStream.getAudioTracks().forEach((track) => {
			track.onended = null;
            track.stop();
        });
		
		this.stop(streamId);
	}

	enableMicInMixedAudio(enable) {
		if (thiz.micGainNode != null) {
			if (enable) {
				thiz.micGainNode.gain.value = 1;
			}
			else {
				thiz.micGainNode.gain.value = 0;
			}
		}
	}

	publish(streamId, token) {
		var jsCmd = {
				command : "publish",
				streamId : streamId,
				token : token,
				video: thiz.mediaConstraints.video == false ? false : true,
				audio: thiz.mediaConstraints.audio == false ? false : true,
		};

		thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
	}


	joinRoom(roomName) {
		thiz.roomName = roomName;

		var jsCmd = {
				command : "joinRoom",
				room: roomName,
		}

		thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
	}

	play(streamId, token) {
		thiz.playStreamId.push(streamId);
		var jsCmd =
		{
				command : "play",
				streamId : streamId,
				token : token,
		}

		thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
	}

	stop(streamId) {
		this.closePeerConnection(streamId);

		var jsCmd = {
				command : "stop",
				streamId: streamId,
		};

		thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
	}

	join(streamId) {
		var jsCmd = {
				command : "join",
				streamId : streamId,
		};


		thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
	}

	leaveFromRoom(roomName) {
		thiz.roomName = roomName;
		var jsCmd = {
				command : "leaveFromRoom",
				room: roomName,
		};

		thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
	}

	leave(streamId) {

		var jsCmd = {
				command : "leave",
				streamId: streamId,
		};

		thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
		this.closePeerConnection(streamId);
	}

	getStreamInfo(streamId) {
		var jsCmd = {
				command : "getStreamInfo",
				streamId: streamId,
		};
		thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
	}

	gotStream(stream) 
	{	
		thiz.localStream = stream;
		thiz.setRemoteSource(thiz.localStream);
	};

	switchVideoCapture(streamId) {
		var mediaConstraints = {
				video : true,
				audio : false
		};

		this.switchVideoSource(streamId, mediaConstraints, null);
	}

	arrangeStreams(stream, onEndedCallback) {
		var videoTrack = thiz.localStream.getVideoTracks()[0];
		thiz.localStream.removeTrack(videoTrack);
		videoTrack.stop();
		thiz.localStream.addTrack(stream.getVideoTracks()[0]);
		this.localVideo.srcObject = thiz.localStream;
		if (onEndedCallback != null) {
			stream.getVideoTracks()[0].onended = (event) => {
				onEndedCallback(event);
			}
		}
	}

	switchVideoSource(streamId, mediaConstraints, onEndedCallback) {
		this.getMedia(mediaConstraints)
		.then((stream) => {
			if (thiz.remotePeerConnection[streamId] != null) {
				var videoTrackSender = thiz.remotePeerConnection[streamId].getSenders().find((s) => {
					return s.track.kind == "video";
				});

				videoTrackSender.replaceTrack(stream.getVideoTracks()[0]).then((result) => {
					this.arrangeStreams(stream, onEndedCallback);

				}).catch((error) => {
					//console.log(error.name);
				});
			}
			else {
				this.arrangeStreams(stream, onEndedCallback);	
			}
		})
		.catch((error) => {
			thiz.onError(error.name);
		});
	}


	onTrack(event, streamId) {
		if (thiz.remoteStream != null) {
			thiz.setRemoteSource(event.streams[0]);
			//console.log('Received remote stream');
		}
		else {
			var dataObj = {
					track: event.streams[0],
					streamId: streamId
			}
			thiz.setRemoteSource(event.streams[0]);
			//thiz.callback("newStreamAvailable", dataObj);
		}
	}

	iceCandidateReceived(event, streamId) {
		if (event.candidate) {

			var jsCmd = {
					command : "takeCandidate",
					streamId : streamId,
					label : event.candidate.sdpMLineIndex,
					id : event.candidate.sdpMid,
					candidate : event.candidate.candidate
			};

			if (thiz.debug) {
				//console.log("sending ice candiate for stream Id " + streamId );
				//console.log(JSON.stringify(event.candidate));
			}

			thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
		}
	}


	initPeerConnection(streamId) {
		if (thiz.remotePeerConnection[streamId] == null) 
		{
			//console.log('Created new peer connection');
			var closedStreamId = streamId;
			//console.log("stream id in init peer connection: " + streamId + " close dstream id: " + closedStreamId);
			thiz.remotePeerConnection[streamId] = new RTCPeerConnection(thiz.peerconnection_config);
			//console.log("Play Stream ID:", thiz.playStreamId, streamId);
			if (!thiz.playStreamId.includes(streamId)) 
			{
				thiz.remotePeerConnection[streamId].addStream(thiz.localStream);
			}
			thiz.remotePeerConnection[streamId].onicecandidate = (event) => {
				this.iceCandidateReceived(event, closedStreamId);
			}
			thiz.remotePeerConnection[streamId].onaddstream = function(event) {
				this.onTrack({streams: event.target._remoteStreams}, closedStreamId);
			}.bind(this);
		}
	}

	closePeerConnection(streamId) {
		if (thiz.remotePeerConnection[streamId] != null
				&& thiz.remotePeerConnection[streamId].signalingState != "closed") {
			thiz.remotePeerConnection[streamId].close();
			thiz.remotePeerConnection[streamId] = null;
			delete thiz.remotePeerConnection[streamId];
			var playStreamIndex = thiz.playStreamId.indexOf(streamId);
			if (playStreamIndex != -1) {
				thiz.playStreamId.splice(playStreamIndex, 1);
			}

		}
	}

	signallingState(streamId) {
		if (thiz.remotePeerConnection[streamId] != null) {
			return thiz.remotePeerConnection[streamId].signalingState;
		}
		return null;
	}

	iceConnectionState(streamId) {
		if (thiz.remotePeerConnection[streamId] != null) {
			return thiz.remotePeerConnection[streamId].iceConnectionState;
		}
		return null;
	}

	gotDescription(configuration, streamId) 
	{

		thiz.remotePeerConnection[streamId]
		.setLocalDescription(configuration)
		.then((responose) =>
		{
			var jsCmd = {
					command : "takeConfiguration",
					streamId : streamId,
					type : configuration.type,
					sdp : configuration.sdp

			};

			if (thiz.debug) {
				console.log("local sdp: ");
				console.log(configuration.sdp);
			}

			thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));

		}).catch((error) =>{
			console.error("Cannot set local description. Error is: " + error);
		});
	}

	turnOffLocalCamera(){
		if (thiz.remotePeerConnection != null) {

			var track = thiz.localStream.getVideoTracks()[0];
			track.enabled = false;
		}
		else {
			thiz.onError("NoActiveConnection");
		}
	}

	turnOnLocalCamera(){
		if (thiz.remotePeerConnection != null) {
			var track = thiz.localStream.getVideoTracks()[0];
			track.enabled = true;
		}
		else {
			thiz.onError("NoActiveConnection");
		}
	}

	muteLocalMic() {
		if (thiz.remotePeerConnection != null) {
			var track = thiz.localStream.getAudioTracks()[0];
			track.enabled = false;
		}
		else {
			thiz.onError("NoActiveConnection");
		}
	}

	/**
	 * if there is audio it calls onError with "AudioAlreadyActive" parameter
	 */
	unmuteLocalMic() {
		if (thiz.remotePeerConnection != null) {
			var track = thiz.localStream.getAudioTracks()[0];
			track.enabled = true;
		}
		else {
			thiz.onError("NoActiveConnection");
		}
	}

	takeConfiguration(idOfStream, configuration, typeOfConfiguration) 
	{
		//console.log('taking configuration', idOfStream, typeOfConfiguration);

		var streamId = idOfStream
		var type = typeOfConfiguration;
		var conf = configuration;

		this.initPeerConnection(streamId);

		//AntMedia doesn't support VP8 which causes android to crash
		thiz.remotePeerConnection[streamId].setRemoteDescription(new RTCSessionDescription({
			sdp : conf,
			type : type
		})).then((response) => {

			if (thiz.debug) {
				console.log("set remote description is succesfull with response: " + response + " for stream : " 
					+ streamId + " and type: " + type);
			}

			if (type == "offer") {
				//SDP constraints may be different in play mode
				thiz.remotePeerConnection[streamId].createAnswer(thiz.sdp_constraints)
				.then((configuration) => {
					this.gotDescription(configuration, streamId);
				})
				.catch((error) =>
				{
					console.error("create answer error :" + error);
				});
			}

		}).catch((error) => {
			if (thiz.debug) {
				console.error("set remote description is failed with error: " + error);
			}
		});
	}

	takeCandidate(idOfTheStream, sdpMLineIndex, sdpMid, tmpCandidate) {
		var streamId = idOfTheStream;
		var candidateSdp = tmpCandidate;

		var candidate = new RTCIceCandidate({
			sdpMLineIndex : sdpMLineIndex,
			sdpMid: sdpMid,
			candidate : candidateSdp
		});

		this.initPeerConnection(streamId);

		thiz.remotePeerConnection[streamId].addIceCandidate(candidate)
		.then((response) => {
			if (thiz.debug) {
				console.log("Candidate is added for stream " + streamId);
			}
		})
		.catch((error) =>{ 
			console.log(candidate);
			console.error("ice candiate cannot be added for stream id: " + streamId + " error is: " + error  );
		});

	}

	startPublishing(idOfStream) {
		var streamId = idOfStream;

		this.initPeerConnection(streamId);

		return thiz.remotePeerConnection[streamId].createOffer(thiz.sdp_constraints)
		.then((configuration) => {
			this.gotDescription(configuration, streamId);
		})
		.catch((e) => {
			console.log(e);
		});
	}

	onMessageReceived(event){
		var obj = JSON.parse(event.data);
		console.log(obj);
		if (obj.command == "start") 
		{
			if (thiz.debug) {
				console.log("received start command");
			}

			this.startPublishing(obj.streamId);
		}
		else if (obj.command == "takeCandidate") {

			if (thiz.debug) {
				console.log("received ice candidate for stream id " + obj.streamId);
			}

			this.takeCandidate(obj.streamId, obj.label, obj.id, obj.candidate);

		} else if (obj.command == "takeConfiguration") {

			if (thiz.debug) {
				console.log("received remote description type for stream id: " + obj.streamId + " type: " + obj.type );
			}
			this.takeConfiguration(obj.streamId, obj.sdp, obj.type);
		}
		else if (obj.command == "stop") {
			this.closePeerConnection(obj.streamId);
		}
		else if (obj.command == "error") {
			thiz.onError(obj.definition);
		}
		else if (obj.command == "notification") {
			thiz.onEvent(obj.definition, obj);
			// if (obj.definition == "play_finished" || obj.definition == "publish_finished") {
			// 	this.closePeerConnection(obj.streamId);
			// }
		}
		else if (obj.command == "streamInformation") {
			thiz.onEvent(obj.command, obj);
		}
	}

	disconnect(){
		this.webSocketAdaptor.disconnect();
	}
}
