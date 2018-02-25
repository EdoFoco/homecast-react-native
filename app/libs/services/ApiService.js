import axios from 'axios';
    //baseURL: 'http://46.101.93.197',

let apiClient = axios.create({
    baseURL: 'http://192.168.1.76:8111',
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
        return apiClient.post('api/auth/login', credentials)
        .catch((e) => {
            console.warn(e);
            throw e;
        });
    }

    static getLoggedInUser(){
        return apiClient.get('api/users/me')
        .catch((e) => {
            console.warn(e);
            throw e;
        });
    }

    static getProperties(){
        return apiClient.get('api/properties')
        .catch((e) => {
            console.warn(e);
            throw e;
        });
    }

    static getProperty(propertyid){
        return apiClient.get(`api/properties/${propertyid}`)
        .catch((e) => {
            console.warn(e);
            throw e;
        });
    }

    static getUserProperties(userId){
       return apiClient.get(`api/users/${userId}/properties`)
       .catch((e) => {
        console.warn(e);
        throw e;
    });
    }
    
    static getViewing(viewingId){
        return apiClient.get(`api/viewings/${ viewingId }`)
        .catch((e) => {
            console.warn(e);
            throw e;
        });
    }

    static getPropertyViewings(propertyId){
       return apiClient.get(`api/properties/${ propertyId }/viewings`)
       .catch((e) => {
            console.warn(e);
            throw e;
        });
    }

    static addToFavourites(userId, propertyId){
       return apiClient.post(`api/users/${ userId }/favourites`, { property_id: propertyId})
       .catch((e) => {
            console.warn(e);
            throw e;
        });
    }

    static removeFromFavourites(userId, propertyId){
        return apiClient.delete(`api/users/${ userId }/favourites?property_id=${propertyId}`)
        .catch((e) => {
            console.warn(e);
            throw e;
        });
     }

    static createViewingReservation(userId, viewingId){
        return apiClient.post(`api/users/${ userId }/viewing-reservations`, { viewing_id: viewingId})
        .catch((e) => {
            console.warn(e);
            throw e;
        });
     }

     static createViewing(propertyId, viewingInfo){
        return apiClient.post(`api/properties/${ propertyId }/viewings`, viewingInfo)
        .catch((e) => {
            console.warn(e);
            throw e;
        });
     }

    static deleteViewingReservation(userId, viewingId){
        return apiClient.delete(`api/users/${ userId }/viewing-reservations/${viewingId}`)
        .catch((e) => {
            console.warn(e);
            throw e;
        });
     }

    static getViewingReservations(userId){
        return apiClient.get(`api/users/${userId}/viewing-reservations`)
        .catch((e) => {
            console.warn(e);
            throw e;
        });
     }

    static updateProperty(property){
        return apiClient.put(`api/properties/${property.id}`, property)
        .catch((e) => {
            console.warn(e);
            throw e;
        });
    }

    static getScrapers(){
        return apiClient.get(`api/scrapers`)
        .catch((e) => {
            console.warn(e);
            throw e;
        });
    }

    static importProperty(id, url){
        return apiClient.post(url, { property_id: id })
        .catch((e) => {
            console.warn(e);
            throw e;
        });
    }
    
}

export default ApiService