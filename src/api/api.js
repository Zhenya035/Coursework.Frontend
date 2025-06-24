import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://localhost:5179',//https://coursework.somee.com
    timeout: 5000,
});

export default {
    register(userData) {
        return apiClient.post('users/register', userData);
    },
    login(userData) {
        return apiClient.post('users/login', userData);
    },
    getUsers(userId) {
        return apiClient.get(`users/${userId}/all`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    deleteUsers(userIds) {
        return apiClient.delete(`users/delete`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            data: userIds
        });
    },
    blockUsers(userIds) {
        return apiClient.put(`users/block`,  userIds, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    unblockUsers(userIds) {
        return apiClient.put(`users/unblock`,  userIds, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    makeAdmin(userIds) {
        return apiClient.put(`users/makeAdmin`,  userIds, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    makeUser(userIds) {
        return apiClient.put(`users/makeUser`,  userIds, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    }
}