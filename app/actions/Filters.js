import * as types from './Types';

export function updateFilters(filters){
    return {
        type: types.UPDATE_FILTERS,
        filters: filters
    }
}

