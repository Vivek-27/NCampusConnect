import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

export const logIn = (formData) => API.post('/api/users/login', formData);

export const signUp = (formData) => API.post('/api/users/register', formData);
