import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ncampusconnect-1.onrender.com',

  withCredentials: true
});

export const addItem = (itemData) => API.post(`/api/items`, itemData);

export const fetchMyItems = () => API.get(`/api/items/myItems`);
export const fetchUserItems = (id) => API.get(`/api/items/userItems/${id}`);

export const fetchItems = (params) => API.get(`/api/items`, { params });

export const updateItem = (itemId, updatedData) =>
  API.put(`/api/items/${itemId}`, updatedData);

export const deleteItem = (itemId) => API.delete(`/api/items/${itemId}`);
