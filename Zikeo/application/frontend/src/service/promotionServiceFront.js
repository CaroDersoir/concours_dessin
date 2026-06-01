// Service promotions — CRUD sur /api/promotions
import api from './api';

export const getAllPromotions = async () => {
    const {data} = await api.get('/api/promotions');
    return data;
};

export const getPromotionById = async (id) => {
    const {data} = await api.get(`/api/promotions/${id}`);
    return data;
};

export const validatePromoCode = async (code) => {
    const {data} = await api.get(`/api/promotions/validate/${encodeURIComponent(code)}`);
    return data;
};

export const createPromotion = async (payload) => {
    const {data} = await api.post('/api/promotions', payload);
    return data;
};

export const updatePromotion = async (id, payload) => {
    const {data} = await api.put(`/api/promotions/${id}`, payload);
    return data;
};

export const deletePromotion = async (id) => {
    await api.delete(`/api/promotions/${id}`);
};
