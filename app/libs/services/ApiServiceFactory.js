import ApiService from './ApiService';

export default class ApiServiceFactory {

    static apiService;

    static async getInstance(){
        if(!this.apiService){
            this.apiService = new ApiService();
        }

        var token = this.apiService.apiClient.defaults.headers.common['Authorization'];
        if(!token){
            await this.apiService.loadTokenFromStorage();
        }

        return this.apiService;
    }
}