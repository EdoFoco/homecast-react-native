import axios from 'axios';
import { AsyncStorage } from 'react-native';
    //baseURL: 'http://46.101.93.197',

class ApiService {
  
    apiClient;

    constructor(){
        this.apiClient = axios.create({
            baseURL: 'http://192.168.1.76:8111',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'dataType': 'json',
              }
        });
    }

    async loadTokenFromStorage(){
        var token = await AsyncStorage.getItem('@AuthToken:key');
        if(token){
            this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${ token }`;
        }
    }

    async login(credentials){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.post('api/auth/login', credentials);
    }

    async getLoggedInUser(){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.get('api/users/me');
    }

     async getProperties(){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.get('api/properties');
    }

     async getProperty(propertyid){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.get(`api/properties/${propertyid}`);
    }

     async getUserProperties(userId){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.get(`api/users/${userId}/properties`);
    }
    
     async getViewing(viewingId){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.get(`api/viewings/${ viewingId }`);
    }

     async getPropertyViewings(propertyId){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.get(`api/properties/${ propertyId }/viewings`);
    }

     async addToFavourites(userId, propertyId){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.post(`api/users/${ userId }/favourites`, { property_id: propertyId});
    }

     async removeFromFavourites(userId, propertyId){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.delete(`api/users/${ userId }/favourites?property_id=${propertyId}`);
     }

     async createViewingReservation(userId, viewingId){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.post(`api/users/${ userId }/viewing-reservations`, { viewing_id: viewingId});
     }

      async createViewing(propertyId, viewingInfo){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.post(`api/properties/${ propertyId }/viewings`, viewingInfo);
     }

     async deleteViewingReservation(userId, viewingId){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.delete(`api/users/${ userId }/viewing-reservations/${viewingId}`);
     }

     async getViewingReservations(userId){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.get(`api/users/${userId}/viewing-reservations`)
     }

     async updateProperty(property){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.put(`api/properties/${property.id}`, property);
    }

     async getScrapers(){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.get(`api/scrapers`);
    }

     async importProperty(id, url){
        // await this.loadTokenIfNotSet();
        return await this.apiClient.post(url, { property_id: id });
    }
    
}

export default ApiService