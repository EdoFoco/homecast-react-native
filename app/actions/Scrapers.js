import * as types from './Types';
import ApiService from '../libs/services/ApiService';


export function updateScrapers(scrapers){
    return {
        type: types.UPDATE_SCRAPERS,
        scrapers: scrapers
    }
}

export function getScrapers() {
    return (dispatch, getState) => {
      
      return ApiService.getScrapers()
          .then(resp => {
              dispatch(updateScrapers(resp.data.scrapers));
          });
    }
  }
