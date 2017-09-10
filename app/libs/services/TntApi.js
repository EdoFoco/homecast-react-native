//const baseUrl = 'http://138.68.130.61/api/';
const baseUrl = 'http://localhost:8111/api/';

var headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'dataType': 'json',
}

class TntApi {

  static headers() {
    return headers;
  }

  static get(route) {
    return this.xhr(route, null, 'GET');
  }

  static put(route, params) {
    return this.xhr(route, params, 'PUT')
  }

  static post(route, params) {
    return this.xhr(route, params, 'POST')
  }

  static delete(route, params) {
    return this.xhr(route, params, 'DELETE')
  }

  static setAuthToken(token){
    headers.Authorization = 'Bearer ' + token;
  }

  static xhr(route, params, verb) {
    console.log(TntApi.headers());
    const url = `${baseUrl}${route}`
    let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null );
    options.headers = TntApi.headers();
    
    return fetch(url, options).then( resp => {
           return resp.json();
     })
     .then(function(response){
        if(response.status_code >= 400 ){
            throw Error(response.message);
        }

        return response;
     });
  }
}
export default TntApi