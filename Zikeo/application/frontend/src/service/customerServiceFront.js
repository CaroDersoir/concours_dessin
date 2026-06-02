// Service utilisateur — authentification et profil sur /api/users
import api from './api';

export const login = async (email, password) => {
    const {data} = await api.post('/api/users/login', {email, password});
    return data;
};

export const register = async (email, password, recaptchaToken) => {
    const {data} = await api.post('/api/users/register', {email, password, recaptchaToken});
    return data;
};

export const getProfile = async () => {
    const {data} = await api.get('/api/users/profile');
    return data;
};

export const updateProfile = async (payload) => {
    const {data} = await api.put('/api/users/profile', payload);
    return data;
};

export const deleteMyAccount = async () => {
    const {data} = await api.delete('/api/users/profile');
    return data;
};

export const verifyEmail = async (code) => {
    const {data} = await api.post('/api/users/verify-email', {code});
    return data;
};

export const bypassVerify = async (email) => {
    const {data} = await api.post('/api/users/bypass-verify', {email});
    return data;
};

export const getAllUsers = async () => {
    const {data} = await api.get('/api/users/admin/users');
    return data;
};

export const deleteUser = async (id) => {
    const {data} = await api.delete(`/api/users/admin/users/${id}`);
    return data;
};

export const updateUserRole = async (id, role) => {
    const {data} = await api.put(`/api/users/admin/users/${id}/role`, {role});
    return data;
};

export const updateUserPartitionAccess = async (id, canUpload) => {
    const {data} = await api.put(`/api/users/admin/users/${id}/partition-access`, {can_upload_partition: canUpload});
    return data;
};

export const updateUserTeacher = async (id, isTeacher) => {
    const {data} = await api.put(`/api/users/admin/users/${id}/teacher`, {est_professeur: isTeacher});
    return data;
};