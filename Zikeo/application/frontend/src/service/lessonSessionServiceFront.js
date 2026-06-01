// Service séances formations — récupère les séances de l'utilisateur connecté
import api from './api';

export const getMySessions = async () => {
    const { data } = await api.get('/api/lesson-sessions/mine');
    return data;
};
