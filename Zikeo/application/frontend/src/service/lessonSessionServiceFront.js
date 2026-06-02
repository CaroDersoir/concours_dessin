// Service séances formations — CRUD sur /api/lesson-sessions
import api from './api';

export const getAllSessions = async () => {
    const { data } = await api.get('/api/lesson-sessions');
    return data;
};

export const getMySessions = async () => {
    const { data } = await api.get('/api/lesson-sessions/mine');
    return data;
};

export const createSession = async (payload) => {
    const { data } = await api.post('/api/lesson-sessions', payload);
    return data;
};

export const getSessionsByLesson = async (lessonId) => {
    const { data } = await api.get(`/api/lesson-sessions/by-lesson/${lessonId}`);
    return data;
};

export const deleteSession = async (id) => {
    await api.delete(`/api/lesson-sessions/${id}`);
};
