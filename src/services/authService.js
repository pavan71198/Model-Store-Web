import axios from 'axios';
import {API_URL} from "../config";

class AuthService {
    login(username, password) {
        return axios.post(
            API_URL+"/auth/login",
            {username,
                password})
            .then(response => {
                if (response.status === 200){
                    localStorage.setItem("token", response.data);
                }
                return response.status;
            });
    }

    logout() {
        localStorage.clear();
        window.location.reload();
    }

    register(username, password, name){
        return axios.post(
            API_URL+"/auth/register",
            {username,
                password,
                name})
            .then(response => {
                if (response.status === 200){
                    localStorage.setItem("token", response.data);
                }
            });
    }

    getToken() {
        return localStorage.getItem("token");
    }

    getHeader() {
        const token = this.getToken();
        if (token) {
            return { Authorization: "Bearer "+token };
        }
    }
}

export default new AuthService();