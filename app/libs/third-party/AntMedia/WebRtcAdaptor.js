import WSAdaptor from './WSAdaptor';
import {
	RTCIceCandidate,
	RTCPeerConnection,
	RTCSessionDescription
  } from 'react-native-webrtc';

var thiz;
export default class WebRTCAdaptor
{
	constructor(config){
		thiz = this;

		thiz.websocketUrl = 'ws://localhost:5080/WebRTCAppEE/websocket',
		thiz.peerconnection_config = null;
		thiz.sdp_constraints = null;
		thiz.remotePeerConnection = new Array();
		thiz.webSocketAdaptor = null;
		thiz.roomName = null;
		thiz.videoTrackSender = null;
		thiz.audioTrackSender = null;
		thiz.playStreamId = new Array();
		thiz.micGainNode = null;
		thiz.callback = config.callback;
		thiz.callbackError = config.callbackError;
		thiz.isPlayMode = false;
		thiz.setRemoteSource = config.setRemoteSource;
		thiz.remoteStream = config.remoteStream;
		thiz.debug = true;
	
		for(var key in config) {
			if(config.hasOwnProperty(key)) {
				thiz[key] = config[key];
			}
		}
	}
	
	initialize()
	{
		console.log('Initializeing WebRtcAdaptor');
		if (!thiz.isPlayMode && typeof this.mediaConstraints != "undefined")  
		{
			console.log('Its where I dont want it to be');
			// if it is not play mode and media constraint is defined, try to get user media
			
			if (typeof this.mediaConstraints.video != "undefined" && this.mediaConstraints.video != false)
			{
	
				if (this.mediaConstraints.audio.mandatory) 
				{
					navigator.mediaDevices.getUserMedia({audio:true, video:false}).then((micStream) =>{
						navigator.mediaDevices.getUserMedia(this.mediaConstraints)
						.then((stream) =>
								{
							//console.log("audio stream track count: " + audioStream.getAudioTracks().length);
	
							var audioContext = new AudioContext();
							var desktopSoundGainNode = audioContext.createGain();
	
							desktopSoundGainNode.gain.value = 1;
	
							var audioDestionation = audioContext.createMediaStreamDestination();
							var audioSource = audioContext.createMediaStreamSource(stream);
	
							audioSource.connect(desktopSoundGainNode);
	
							thiz.micGainNode = audioContext.createGain();
							thiz.micGainNode.gain.value = 1;
							var audioSource2 = audioContext.createMediaStreamSource(micStream);
							audioSource2.connect(thiz.micGainNode);
	
							desktopSoundGainNode.connect(audioDestionation);
							thiz.micGainNode.connect(audioDestionation);
	
							stream.removeTrack(stream.getAudioTracks()[0]);
							audioDestionation.stream.getAudioTracks().forEach((track) => {
								stream.addTrack(track);
							});
	
							console.log("Running gotStream");
							this.gotStream(stream);
	
								}).catch((error) => {
									thiz.callbackError(error.name, error.message);
								});
					}).catch((error) => {
						thiz.callbackError(error.name, error.message);
					});	
				}
				else {
					this.openStream(this.mediaConstraints);
				}
			}
			else {
				var media_audio_constraint = { audio: this.mediaConstraints.audio };
				navigator.mediaDevices.getUserMedia(media_audio_constraint)
				.then((stream) => {
					this.gotStream(stream);
				})
				.catch((error) => {
					thiz.callbackError(error.name, error.message);
				});
			}
		}
		else {
			if (thiz.webSocketAdaptor == null || thiz.webSocketAdaptor.isConnected() == false) {
				thiz.webSocketAdaptor = new WSAdaptor(thiz.websocketUrl, thiz.callback, thiz.callbackError, (event) => { this.onMessageReceived(event) });
				thiz.webSocketAdaptor.initialize();
			}
		}
	}

	/**
	 * Get user media
	 */
	getUserMedia(mediaConstraints, audioConstraint) {
		navigator.mediaDevices.getUserMedia(mediaConstraints)
		.then((stream) => {

			//this trick, getting audio and video separately, make us add or remove tracks on the fly
			var audioTrack = stream.getAudioTracks();
			if (audioTrack.length > 0) {
				stream.removeTrack(audioTrack[0]);
			}
					
			//add callback if desktop is sharing
			if (mediaConstraints.video != "undefined" 
				  && typeof mediaConstraints.video.mandatory != "undefined"
				  && typeof mediaConstraints.video.mandatory.chromeMediaSource != "undefined"
				  && mediaConstraints.video.mandatory.chromeMediaSource == "desktop") {
				
				stream.getVideoTracks()[0].onended = (event) => {
					thiz.callback("screen_share_stopped");
				}
			}

			//now get only audio to add this stream
			if (audioConstraint != "undefined" && audioConstraint != false) {
				var media_audio_constraint = { audio: audioConstraint};
				navigator.mediaDevices.getUserMedia(media_audio_constraint)
				.then((audioStream) => {
					stream.addTrack(audioStream.getAudioTracks()[0]);
					this.gotStream(stream);
				})
				.catch((error) => {
					thiz.callbackError(error.name, error.message);
				});
			}
			else {
				this.gotStream(stream);
			}
		})
		.catch((error) => {
			thiz.callbackError(error.name, error.message);
		});
	}

	/**
	 * Open media stream, it may be screen, camera or audio
	 */
	openStream(mediaConstraints) {
		this.mediaConstraints = mediaConstraints;
		var audioConstraint = false;
		if (typeof mediaConstraints.audio != "undefined" && mediaConstraints.audio != false) {
			audioConstraint = mediaConstraints.audio;
		}
		if (typeof mediaConstraints.video != "undefined" && mediaConstraints.video == "screen") {
			var callback = (message) =>
			{
				if (message.data == "rtcmulticonnection-extension-loaded") {
					console.log("rtcmulticonnection-extension-loaded parameter is received");
					window.postMessage("get-sourceId", "*");
				}
				else if (message.data == "PermissionDeniedError") {
					console.log("Permission denied error");
					thiz.callbackError("screen_share_permission_denied");
				}
				else if (message.data && message.data.sourceId) {
					var mediaConstraints = {
							audio: false,
							video: {
								mandatory: {
									chromeMediaSource: 'desktop',
									chromeMediaSourceId: message.data.sourceId,
								},
								optional: []
							}
					};

					this.getUserMedia(mediaConstraints, audioConstraint);

					//remove event listener
					window.removeEventListener("message", callback);	    
				}

			}
			window.addEventListener("message", callback, false);

			window.postMessage("are-you-there", "*");
		}
		else {
			this.getUserMedia(mediaConstraints, audioConstraint);
		}
	}
	
	/**
	 * Closes stream, if you want to stop peer connection, call stop(streamId)
	 */
	closeStream() {
		
		this.localStream.getVideoTracks().forEach((track) => {
			track.onended = null;
            track.stop();
        });
		
		this.localStream.getAudioTracks().forEach((track) => {
			track.onended = null;
            track.stop();
        });
		
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
				video: this.mediaConstraints.video == false ? false : true,
						audio: this.mediaConstraints.audio == false ? false : true,
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
		console.log ("leave request is sent for "+ roomName);

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
		this.localStream = stream;
		this.localVideo.srcObject = stream;
		if (thiz.webSocketAdaptor == null || thiz.webSocketAdaptor.isConnected() == false) {
			thiz.webSocketAdaptor = new WSAdaptor(thiz.websocketUrl, thiz.callback, thiz.callbackError, this.onMessageReceived);
			thiz.webSocketAdaptor.initialize();
		}
	};

	switchVideoCapture(streamId) {
		var mediaConstraints = {
				video : true,
				audio : false
		};

		this.switchVideoSource(streamId, mediaConstraints, null);
	}

	arrangeStreams(stream, onEndedCallback) {
		var videoTrack = this.localStream.getVideoTracks()[0];
		this.localStream.removeTrack(videoTrack);
		videoTrack.stop();
		this.localStream.addTrack(stream.getVideoTracks()[0]);
		this.localVideo.srcObject = this.localStream;
		if (onEndedCallback != null) {
			stream.getVideoTracks()[0].onended = (event) => {
				onEndedCallback(event);
			}
		}
	}

	switchVideoSource(streamId, mediaConstraints, onEndedCallback) {
		navigator.mediaDevices.getUserMedia(mediaConstraints)
		.then((stream) => {

			if (thiz.remotePeerConnection[streamId] != null) {
				var videoTrackSender = thiz.remotePeerConnection[streamId].getSenders().find((s) => {
					return s.track.kind == "video";
				});

				videoTrackSender.replaceTrack(stream.getVideoTracks()[0]).then((result) => {
					this.arrangeStreams(stream, onEndedCallback);

				}).catch((error) => {
					console.log(error.name);
				});
			}
			else {
				this.arrangeStreams(stream, onEndedCallback);	
			}

		})
		.catch((error) => {
			thiz.callbackError(error.name);
		});
	}


	onTrack(event, streamId) {
		if (this.remoteStream != null) {
			this.setRemoteSource(event.streams[0]);
			this.remoteStream.srcObject = event.streams[0];
			console.log('Received remote stream');
		}
		else {
			var dataObj = {
					track: event.streams[0],
					streamId: streamId
			}
			this.setRemoteSource(event.streams[0]);
			thiz.callback("newStreamAvailable", dataObj);
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
				console.log("sending ice candiate for stream Id " + streamId );
				console.log(JSON.stringify(event.candidate));
			}

			thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
		}
	}


	initPeerConnection(streamId) {
		if (thiz.remotePeerConnection[streamId] == null) 
		{
			console.log('Created new peer connection');
			var closedStreamId = streamId;
			console.log("stream id in init peer connection: " + streamId + " close dstream id: " + closedStreamId);
			thiz.remotePeerConnection[streamId] = new RTCPeerConnection(thiz.peerconnection_config);
			console.log("Play Stream ID:", thiz.playStreamId, streamId);
			if (!thiz.playStreamId.includes(streamId)) 
			{
				console.log('1');
				thiz.remotePeerConnection[streamId].addStream(this.localStream);
			}
			thiz.remotePeerConnection[streamId].onicecandidate = (event) => {
				console.log('2');

				this.iceCandidateReceived(event, closedStreamId);
			}
			thiz.remotePeerConnection[streamId].onaddstream = function(event) {
				console.log('3');

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
			console.log("Set local description successfully for stream Id " + streamId);

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

			var track = this.localStream.getVideoTracks()[0];
			track.enabled = false;
		}
		else {
			thiz.callbackError("NoActiveConnection");
		}
	}

	turnOnLocalCamera(){
		if (thiz.remotePeerConnection != null) {
			var track = this.localStream.getVideoTracks()[0];
			track.enabled = true;
		}
		else {
			thiz.callbackError("NoActiveConnection");
		}
	}

	muteLocalMic() {
		if (thiz.remotePeerConnection != null) {
			var track = this.localStream.getAudioTracks()[0];
			track.enabled = false;
		}
		else {
			thiz.callbackError("NoActiveConnection");
		}
	}

	/**
	 * if there is audio it calls callbackError with "AudioAlreadyActive" parameter
	 */
	unmuteLocalMic() {
		if (thiz.remotePeerConnection != null) {
			var track = this.localStream.getAudioTracks()[0];
			track.enabled = true;
		}
		else {
			thiz.callbackError("NoActiveConnection");
		}
	}

	takeConfiguration(idOfStream, configuration, typeOfConfiguration) 
	{
		console.log('taking configuration', idOfStream, typeOfConfiguration);

		var streamId = idOfStream
		var type = typeOfConfiguration;
		var conf = configuration;

		this.initPeerConnection(streamId);

		thiz.remotePeerConnection[streamId].setRemoteDescription(new RTCSessionDescription({
			sdp : conf,
			type : type
		})).then((response) => {

			if (thiz.debug) {
				console.log("set remote description is succesfull with response: " + response + " for stream : " 
						+ streamId + " and type: " + type);
				console.log(conf);
			}

			if (type == "offer") {
				//SDP constraints may be different in play mode
				console.log("try to create answer for stream id: " + streamId);

				thiz.remotePeerConnection[streamId].createAnswer(thiz.sdp_constraints)
				.then((configuration) =>
						{
					console.log("created answer for stream id: " + streamId);
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


	takeCandidate(idOfTheStream, tmpLabel, tmpCandidate) {
		var streamId = idOfTheStream;
		var label = tmpLabel;
		var candidateSdp = tmpCandidate;

		var candidate = new RTCIceCandidate({
			sdpMLineIndex : label,
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
			console.error("ice candiate cannot be added for stream id: " + streamId + " error is: " + error  );
			console.error(candidate);
		});

	}

	startPublishing(idOfStream) {
		var streamId = idOfStream;

		this.initPeerConnection(streamId);

		thiz.remotePeerConnection[streamId].createOffer(thiz.sdp_constraints)
		.then((configuration) => {
			this.gotDescription(configuration, streamId);
		})
		.catch((error) => {

			console.error("create offer error for stream id: " + streamId + " error: " + error);
		});
	}

	onMessageReceived(event){
		var obj = JSON.parse(event.data);
		console.log('MESSAGE: ', obj);

		if (obj.command == "start") 
		{
			//this command is received first, when publishing so playmode is false

			if (thiz.debug) {
				console.log("received start command");
			}

			this.startPublishing(obj.streamId);
		}
		else if (obj.command == "takeCandidate") {

			if (thiz.debug) {
				console.log("received ice candidate for stream id " + obj.streamId);
			}

			this.takeCandidate(obj.streamId, obj.label, obj.candidate);

		} else if (obj.command == "takeConfiguration") {

			if (thiz.debug) {
				console.log("received remote description type for stream id: " + obj.streamId + " type: " + obj.type );
			}
			this.takeConfiguration(obj.streamId, obj.sdp, obj.type);
		}
		else if (obj.command == "stop") {
			console.log("Stop command received");
			this.closePeerConnection(obj.streamId);
		}
		else if (obj.command == "error") {
			thiz.callbackError(obj.definition);
		}
		else if (obj.command == "notification") {
			thiz.callback(obj.definition, obj);
			if (obj.definition == "play_finished" || obj.definition == "publish_finished") {
				this.closePeerConnection(obj.streamId);
			}
		}
		else if (obj.command == "streamInformation") {
			thiz.callback(obj.command, obj);
		}
	}
}
