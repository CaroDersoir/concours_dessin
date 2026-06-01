// Service partitions — lecture et suppression sur /api/partitions
import api from './api';

export const getAllPartitions = async () => {
    const {data} = await api.get('/api/partitions');
    return data;
};

export const deletePartition = async (id) => {
    await api.delete(`/api/partitions/${id}`);
};