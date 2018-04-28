import * as types from '../actions/Types';

const initialConferenceState = { 
      info: 'Initializing',
      status: 'Connecting',
      isFront: false,
      selfViewSrc: null,
      isPresenter: false,
      hasError: false,
      error: null,
      connectionState: null,
      viewer: {
        sdpOffer: '',
        sdpAnswer: '',
        candidate: '',
        streamUrl: '',
        iceCandidates: []
      },
      presenter:{
        sdpOffer: '',
        sdpAnswer: '',
        candidate: '',
        streamUrl: '',
        iceCandidates: []
      },
      roomStatus: {
          id: '',
          presenterConnected: false,
          viewers: []
      }
};

export default function webrtc(state = initialConferenceState, action) {
  switch(action.type){
      case types.SET_IS_PRESENTER:
            return { ...state,  isPresenter: action.isPresenter };
    case types.SET_SOCKET_ERROR:
        return { ...state,  hasError: action.data.hasError, error: action.data.error };
    
    case 'viewer':
        var viewer = {...state.viewer};
        viewer.sdpOffer = action.data.sdpOffer;
        return { ...state,  viewer: viewer };
    
    case 'presenter':
        var presenter = {...state.presenter};
        presenter.sdpOffer = action.data.sdpOffer;
        return { ...state,  presenter: presenter };
   
    case types.CLIENT_VIEWER_RESPONSE:
        var viewer = {...state.viewer};
        viewer.isProcessingAnswer = true,
        viewer.sdpAnswer = action.data.sdpAnswer
        return { ...state, viewer: viewer};
    
    case types.CLIENT_PRESENTER_RESPONSE:
        var presenter = {...state.presenter};
        presenter.isProcessingAnswer = true,
        presenter.sdpAnswer = action.data.sdpAnswer
        return { ...state, presenter: presenter};

    case types.CLIENT_ROOM_STATUS:
        console.log(action.data);
        if(!action.data.roomStatus.presenterConnected){
            initialConferenceState.viewer.iceCandidates = [];
            initialConferenceState.presenter.iceCandidates = [];
            return {...initialConferenceState};
        }

        return {...state, roomStatus: action.data.roomStatus }
      
    case 'updateStreamUrl':
        var viewer = {...state.viewer};
        viewer.streamUrl = action.url
        return { ...state, viewer: viewer};
    
    case 'iceCandidate':
        var viewer = {...state.viewer};
        var candidates = viewer.iceCandidates;

        var index = candidates.indexOf(action.data.candidate);
        if(index == -1){
            candidates.push(action.data.candidate);
        }

        var presenter = {...state.presenter, iceCandidates: candidates};
        //var viewer = {...state.viewer, iceCandidates: candidates};
        
        return { ...state, viewer: viewer, presenter: presenter};
    
    case types.UPDATE_CONNECTION_STATUS:
        return { ...state, status: action.status };

    case types.SERVER_DISCONNECT:
        initialConferenceState.viewer.iceCandidates = [];
        initialConferenceState.presenter.iceCandidates = [];
        return {...initialConferenceState};
    default:
      return state;
  }
}
