import axios from 'axios';

let apiClient = axios.create({
    baseURL: 'http://localhost:8111',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'dataType': 'json',
      }
  });

class ApiService {
  
    static setAuthToken(authToken){
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${ authToken }`;
    }

    static login(credentials){
        return new Promise(function(resolve, reject){
            apiClient.post('api/auth/login', credentials)
            .then( resp => {
                resolve(resp)
            })
            .catch( ex => {
                reject(ex);
            });
        });
    }

    static getLoggedInUser(){
        return new Promise(function(resolve, reject){
            apiClient.get('api/users/me')
            .then( resp => {
                resolve(resp)
            })
            .catch( ex => {
                reject(ex);
            });
        });
    }

    static getProperties(){
        return new Promise(function(resolve, reject){
            apiClient.get('api/properties')
            .then( resp => {
                resolve(resp)
            })
            .catch( ex => {
                reject(ex);
            });
        });
    }

    static getPropertyViewings(propertyId){
        return new Promise(function(resolve, reject){
            apiClient.get(`api/properties/${ propertyId }/viewings`)
            .then( resp => {
                resolve(resp)
            })
            .catch( ex => {
                reject(ex);
            });
        });
    }
}

export default ApiService