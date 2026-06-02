// Service réservations — lecture et création sur /api/reservations
import api from './api';

export const getAllReservations = async () => {
    const { data } = await api.get('/api/reservations');
    return data;
};

export const createReservation = async (payload) => {
    const { data } = await api.post('/api/reservations', payload);
    return data;
};

export const cancelReservation = async (id) => {
    await api.delete(`/api/reservations/${id}`);
};

export const adminDeleteReservation = async (id) => {
    await api.delete(`/api/reservations/admin/${id}`);
};

export const getPendingDerogations = async () => {
    const { data } = await api.get('/api/reservations/derogations');
    return data;
};

export const adminUpdateReservation = async (id, payload) => {
    const { data } = await api.put(`/api/reservations/admin/${id}`, payload);
    return data;
};

export const updateDerogationStatus = async (id, statut) => {
    const { data } = await api.put(`/api/reservations/${id}/derogation`, { statut });
    return data;
};
