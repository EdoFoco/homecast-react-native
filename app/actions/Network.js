import * as types from './Types';

export function updateSignalStrength(networkType, strength){
    return {
        type: types.UPDATE_SIGNAL_STRENGTH,
        networkType: networkType,
        strength: strength
    }
}