// Service home cards — lecture publique et CRUD admin sur /api/home-cards
import api from './api';

export const getHomeCards = async () => {
    const {data} = await api.get('/api/home-cards');
    return data;
};

export const getAdminHomeCards = async () => {
    const {data} = await api.get('/api/home-cards/admin');
    return data;
};

export const createHomeCard = async (payload) => {
    const {data} = await api.post('/api/home-cards', payload);
    return data;
};

export const updateHomeCard = async (id, payload) => {
    const {data} = await api.put(`/api/home-cards/${id}`, payload);
    return data;
};

export const deleteHomeCard = async (id) => {
    await api.delete(`/api/home-cards/${id}`);
};
