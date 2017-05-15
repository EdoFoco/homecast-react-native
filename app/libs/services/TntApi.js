class TntApi {
  static headers() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'dataType': 'json',
      'Authorization': 'Bearer b9729b8cd51f45f3a69ea4dec47b69d5'
    }
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

  static xhr(route, params, verb) {
    const host = 'http://localhost:8111/api/'
    const url = `${host}${route}`
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