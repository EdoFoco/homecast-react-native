import * as types from './Types';

export function goToSection(sectionName){
    return {
        type: types.GOTO_SECTION,
        sectionName: sectionName
    }
}