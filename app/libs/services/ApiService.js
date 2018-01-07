import axios from 'axios';

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
        return apiClient.post('api/auth/login', credentials);
    }

    static getLoggedInUser(){
        return apiClient.get('api/users/me');
    }

    static getProperties(){
        return apiClient.get('api/properties');
    }

    static getProperty(propertyid){
        return apiClient.get(`api/properties/${propertyid}`);
    }

    static getUserProperties(userId){
       return apiClient.get(`api/users/${userId}/properties`);
    }
    
    static getViewing(viewingId){
        return apiClient.get(`api/viewings/${ viewingId }`)
    }

    static getPropertyViewings(propertyId){
       return apiClient.get(`api/properties/${ propertyId }/viewings`)
    }

    static addToFavourites(userId, propertyId){
       return apiClient.post(`api/users/${ userId }/favourites`, { property_id: propertyId});
    }

    static removeFromFavourites(userId, propertyId){
        return apiClient.delete(`api/users/${ userId }/favourites?property_id=${propertyId}`);
     }

    static createViewingReservation(userId, viewingId){
        return apiClient.post(`api/users/${ userId }/viewing-reservations`, { viewing_id: viewingId});
     }

     static createViewing(propertyId, viewingInfo){
        return apiClient.post(`api/properties/${ propertyId }/viewings`, viewingInfo);
     }

    static deleteViewingReservation(userId, viewingId){
        return apiClient.delete(`api/users/${ userId }/viewing-reservations/${viewingId}`);
     }

    static getViewingReservations(userId){
        return apiClient.get(`api/users/${userId}/viewing-reservations`);
     }

    static updateProperty(property){
        return apiClient.put(`api/properties/${property.id}`, property);
    }

    static getScrapers(){
        return apiClient.get(`api/scrapers`);
    }

    static importProperty(id, url){
        return apiClient.post(url, { property_id: id });
    }
    
}

export default ApiService