// Service litiges — déclaration et suivi des litiges sur /api/litiges
import api from './api';

export const getLitiges = async () => {
    const { data } = await api.get('/api/litiges/mine');
    return data;
};

export const createLitige = async (payload) => {
    const { data } = await api.post('/api/litiges', payload);
    return data;
};

export const getAllLitiges = async () => {
    const { data } = await api.get('/api/litiges');
    return data;
};

export const updateLitigeStatut = async (id, statut) => {
    const { data } = await api.put(`/api/litiges/${id}/statut`, { statut });
    return data;
};
