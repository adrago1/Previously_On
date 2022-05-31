import axios from "axios";

const API_URL = "https://api.betaseries.com/members/auth";

class AuthService {

    login(login, password, client_id) {
        return axios
        .post(API_URL, {
            login,
            password,
            client_id
        })
        .then(response => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        })
    }

    logout() {
        localStorage.removeItem("user");
        window.location = "/home";
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();