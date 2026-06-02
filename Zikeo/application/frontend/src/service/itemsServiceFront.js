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

export const uploadCover = async (itemId, file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('vetementId', itemId);
    const {data} = await api.post('/api/covers', form, {headers: {'Content-Type': 'multipart/form-data'}});
    return data;
};

export const deleteCover = async (coverId) => {
    await api.delete(`/api/covers/${coverId}`);
};

export const getSizes = async (itemId) => {
    const {data} = await api.get(`/api/item-sizes/${itemId}`);
    return data;
};

export const setSizes = async (itemId, sizes) => {
    const {data} = await api.put(`/api/item-sizes/${itemId}`, {sizes});
    return data;
};
