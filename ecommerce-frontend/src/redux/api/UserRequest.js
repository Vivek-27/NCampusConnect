import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

export const updateUser = (formData) =>
  API.put('/api/users/update_user', formData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

export const getUser = (id) => API.get(`/api/users/get_user/${id}`);

export const deleteUser = (formData) =>
  API.delete('/api/users/delete', formData); //todo

export const followUser = (formData) => API.post('/api/users/follow', formData);
export const withdrawfollow = (formData) =>
  API.post('/api/users/withdrawfollow', formData);
export const acceptRequest = (formData) =>
  API.post('/api/users/acceptRequest', formData);
export const denyReq = (formData) => API.post('/api/users/denyReq', formData);
export const friends = (formData) => API.post('/api/users/friends', formData);
export const all_users = () => API.get('/api/users/all_users');

export const followRequests = (formData) =>
  API.get('/api/users/followRequests', formData);
