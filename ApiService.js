import axios from 'axios';

const USER_API_BASE_URL = 'http://localhost:8080/api/device';

class ApiService {

    fetchUsers() {
        return axios.get(USER_API_BASE_URL);
    }

    fetchUserById(userId) {
        return axios.get(USER_API_BASE_URL + '?id=' + userId);
    }

    deleteUser(userId) {
        return axios.delete(USER_API_BASE_URL + '/' + userId);
    }

    addUser(user) {
        return axios.post(USER_API_BASE_URL, user);
    }

    editUser(user) {
        return axios.put(USER_API_BASE_URL + '/' + user.id, user);
    }
    // fetchUserspag(use){
    //     return axios.get(USER_API_BASE_URL +'/page?pageNo='+users.currentPage+'&pageSize=4&sortBy='+userId);
        
    // }

}

export default new ApiService();