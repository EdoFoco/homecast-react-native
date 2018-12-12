import axios from 'axios';
import { AsyncStorage } from 'react-native';
import FormData from 'form-data';

class ApiService {
  
    apiClient;

    constructor(){
        this.apiClient = axios.create({
            baseURL: 'http://localhost:8111',
            //baseURL: 'https://api.homecastapp.com',
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
        console.log(info);
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

     async getProperties(filters){
        
        var path = 'api/properties';

        if(!filters){
            return await this.apiClient.get(path);
        }

        path = 'api/properties?';
        Object.keys(filters).forEach(filter => {
            if(filters[filter]){
                path += `${filter}=${filters[filter]}&`;
            }
        });

        return await this.apiClient.get(path);
    }

     async getProperty(propertyid){
        
        return await this.apiClient.get(`api/properties/${propertyid}`);
    }

    async createProperty(id){
        return await this.apiClient.post('api/properties', { google_place_id: id });
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

     async deleteViewing(viewingId){
        return await this.apiClient.delete(`api/viewings/${viewingId}`);
     }

     async deleteViewingReservation(userId, viewingId){
        
        return await this.apiClient.delete(`api/users/${ userId }/viewing-reservations/${viewingId}`);
     }

     async getViewingReservations(userId){
        
        return await this.apiClient.get(`api/users/${userId}/viewing-reservations`)
     }

     async updateProperty(property){
        console.log(property);
        return await this.apiClient.put(`api/properties/${property.id}`, property);
    }

     async getScrapers(){
        return await this.apiClient.get(`api/scrapers`);
    }

     async importProperty(id, url){
        return await this.apiClient.post(url, { property_id: id });
    }

    async getAddressSuggestions(text, type){
        var params = `input=${text}`;
        if(type){
            params += `&type=${type}`;
        }

        return await this.apiClient.get(`api/autocomplete?${params}`);
    }
    
    async uploadPropertyImage(propertyId, image, progressCallback){
        const config = {
            headers: {...this.apiClient.headers, 'content-type': 'multipart/form-data'},
            onUploadProgress: progressEvent => progressCallback(progressEvent)
        }
        var formData = new FormData();
        formData.append('image', {
            uri: image.path,
            type: image.mime,
            name: image.filename,
        });
        
        return await this.apiClient.post(`api/properties/${propertyId}/photos`, formData, config);
    }

    async deletePropertyImages(propertyId, ids){
        return await this.apiClient.delete(`api/properties/${propertyId}/photos?ids=${ids.join(',')}`);
    }

    async deleteProperty(propertyId){
        return await this.apiClient.delete(`api/properties/${propertyId}`);
    }

    async getChats(){
        return await this.apiClient.get(`api/chats`);
    }

    async createChat(participantIds){
        return await this.apiClient.post(`api/chats`, { participants: participantIds });
    }

    async getMessages(chatId, page){
        return await this.apiClient.get(`api/chats/${chatId}/messages`);
    }

    async sendMessage(chatId, message){
        return await this.apiClient.post(`api/chats/${chatId}/messages`, { message: message });
    }

    async updateDeviceToken(userId, token){
        return await this.apiClient.post(`api/users/${userId}/token`, { token: token });
    }

    async sendViewingInvitationEmail(viewingId, email){
        return await this.apiClient.post(`api/viewings/${viewingId}/invitations`, { user_email: email });
    }

    async activateProperty(propertyId, isActive){
        return await this.apiClient.post(`api/properties/${propertyId}/activation`, { listing_active: isActive });
    }
}

export default ApiService