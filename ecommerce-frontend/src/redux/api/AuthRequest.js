import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ncampusconnect-1.onrender.com',
  withCredentials: true
});

export const logIn = (formData) => API.post('/api/users/login', formData);

export const signUp = (formData) => API.post('/api/users/register', formData);
