import axios from 'axios';
import { AsyncStorage } from 'react-native';
    //baseURL: 'http://46.101.93.197',

class ApiService {
  
    apiClient;

    constructor(){
        this.apiClient = axios.create({
            //baseURL: 'http://192.168.1.76:8111',
            baseURL: 'http://46.101.93.197',
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

    async signup(info){
        
        var resp  = await this.apiClient.post('api/auth/signup', info);
        console.log(resp);
        return resp;
    }

    async login(credentials){
        
        var resp  = await this.apiClient.post('api/auth/login', credentials);
        console.log(resp);
        await AsyncStorage.setItem('@AuthToken:key', `Bearer ${resp.data.token}`);
        await this.loadTokenFromStorage();
        return resp;
    }
    
    async getLoggedInUser(){
        
        return await this.apiClient.get('api/users/me');
    }

     async getProperties(){
        
        return await this.apiClient.get('api/properties');
    }

     async getProperty(propertyid){
        
        return await this.apiClient.get(`api/properties/${propertyid}`);
    }

     async getUserProperties(userId){
        
        return await this.apiClient.get(`api/users/${userId}/properties`);
    }
    
     async getViewing(viewingId){
        
        return await this.apiClient.get(`api/viewings/${ viewingId }`);
    }

     async getPropertyViewings(propertyId){
        
        return await this.apiClient.get(`api/properties/${ propertyId }/viewings`);
    }

     async addToFavourites(userId, propertyId){
        
        return await this.apiClient.post(`api/users/${ userId }/favourites`, { property_id: propertyId});
    }

     async removeFromFavourites(userId, propertyId){
        
        return await this.apiClient.delete(`api/users/${ userId }/favourites?property_id=${propertyId}`);
     }

     async createViewingReservation(userId, viewingId){
        
        return await this.apiClient.post(`api/users/${ userId }/viewing-reservations`, { viewing_id: viewingId});
     }

      async createViewing(propertyId, viewingInfo){
        
        return await this.apiClient.post(`api/properties/${ propertyId }/viewings`, viewingInfo);
     }

     async deleteViewingReservation(userId, viewingId){
        
        return await this.apiClient.delete(`api/users/${ userId }/viewing-reservations/${viewingId}`);
     }

     async getViewingReservations(userId){
        
        return await this.apiClient.get(`api/users/${userId}/viewing-reservations`)
     }

     async updateProperty(property){
        
        return await this.apiClient.put(`api/properties/${property.id}`, property);
    }

     async getScrapers(){
        
        return await this.apiClient.get(`api/scrapers`);
    }

     async importProperty(id, url){
        
        return await this.apiClient.post(url, { property_id: id });
    }
    
}

export default ApiService