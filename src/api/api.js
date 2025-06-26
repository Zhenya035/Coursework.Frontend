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
    getUserById(userId) {
        return apiClient.get(`users/${userId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    changeUserName(userId, name) {
        return apiClient.put(`users/${userId}/update`, name, {
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
    },

    getTemplates(userInfo){
        return apiClient.post(`templates`,  userInfo, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    getTemplateById(templateId) {
        return apiClient.get(`templates/${templateId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    addTemplates(authorId, template) {
        return apiClient.post(`templates/add/author/${authorId}`,  template,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    deleteTemplates(templateId) {
        return apiClient.delete(`templates/${templateId}/delete`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    addAuthorizedUsers(templateId, authorizedUsers) {
        return apiClient.put(`templates/${templateId}/addAuthorizedUsers`, authorizedUsers, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    deleteAuthorizedUsers(templateId, authorizedUsers) {
        return apiClient.put(`templates/${templateId}/addAuthorizedUsers`, authorizedUsers, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },

    getTags(){
        return apiClient.get(`tags`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    getTagById(tagId) {
        return apiClient.get(`tags/${tagId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    addTag(tag) {
        return apiClient.post(`tags/add`, tag, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    updateTag(tagId, tag) {
        return apiClient.put(`tags/${tagId}/update`, tag, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    deleteTag(tagId) {
        return apiClient.delete(`tags/${tagId}/delete`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },

    addLike(templateId, authorId) {
        return apiClient.post(`likes/add/template/${templateId}/author/${authorId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    deleteLike(likeId) {
        return apiClient.delete(`likes/${likeId}/delete`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },

    getFormByTemplate(templateId) {
        return apiClient.get(`forms/template/${templateId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    getFormById(formId) {
        return apiClient.get(`forms/${formId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    fillForm(templateId, authorId, answers) {
        return apiClient.post(`/forms/add/template/${templateId}/author/${authorId}`, answers,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    updateForm(formId, answers) {
        return apiClient.put(`/forms/${formId}/update`, answers,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    deleteForm(formId) {
        return apiClient.delete(`/forms/${formId}/delete`,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },

    getCommentsByTemplate(templateId) {
        return apiClient.get(`comments/template/${templateId}`,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    addComment(templateId, authorId, comment) {
        return apiClient.post(`/comments/add/template/${templateId}/author/${authorId}`, comment,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    updateComment(commentId, comment) {
        return apiClient.put(`comments/${commentId}/update`, comment,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    deleteComment(commentId) {
        return apiClient.delete(`comments/${commentId}/delete`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
}