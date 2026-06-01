// Service leçons — CRUD sur /api/lessons
import api from './api';

export const getAllLessons = async () => {
    const { data } = await api.get('/api/lessons');
    return data;
};

export const getLessonById = async (id) => {
    const { data } = await api.get(`/api/lessons/${id}`);
    return data;
};

export const createLesson = async (payload) => {
    const { data } = await api.post('/api/lessons', payload);
    return data;
};

export const updateLesson = async (id, payload) => {
    const { data } = await api.put(`/api/lessons/${id}`, payload);
    return data;
};

export const deleteLesson = async (id) => {
    await api.delete(`/api/lessons/${id}`);
};
