// Appels API commandes
import api from './api';

export const createOrder = (payload) =>
    api.post('/api/orders', payload).then(r => r.data);

export const getMyOrders = () =>
    api.get('/api/orders/me').then(r => r.data);

export const getAllOrders = () =>
    api.get('/api/orders/admin').then(r => r.data);

export const updateOrderStatus = (id, status) =>
    api.put(`/api/orders/admin/${id}/status`, {status}).then(r => r.data);
