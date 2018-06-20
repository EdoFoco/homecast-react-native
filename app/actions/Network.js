import * as types from './Types';

export function updateSignalStrength(strength){
    return {
        type: types.UPDATE_SIGNAL_STRENGTH,
        strength: strength
    }
}