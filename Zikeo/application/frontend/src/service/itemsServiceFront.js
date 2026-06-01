// Service items — CRUD sur /api/items
import api from './api';

export const getAllItems = async () => {
    const {data} = await api.get('/api/items');
    return data;
};

export const getItemById = async (id) => {
    const {data} = await api.get(`/api/items/${id}`);
    return data;
};

export const createItem = async (payload) => {
    const {data} = await api.post('/api/items', payload);
    return data;
};

export const updateItem = async (id, payload) => {
    const {data} = await api.put(`/api/items/${id}`, payload);
    return data;
};

export const deleteItem = async (id) => {
    await api.delete(`/api/items/${id}`);
};