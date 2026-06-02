// Service partitions — lecture, ajout et suppression sur /api/partitions
import api from './api';

export const getAllPartitions = async () => {
    const {data} = await api.get('/api/partitions');
    return data;
};

export const uploadPartition = async (formData) => {
    const {data} = await api.post('/api/partitions', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
    });
    return data;
};

export const deletePartition = async (id) => {
    await api.delete(`/api/partitions/${id}`);
};