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
