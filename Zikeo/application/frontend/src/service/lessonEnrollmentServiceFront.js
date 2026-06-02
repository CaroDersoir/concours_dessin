// Service inscriptions formations — admin
import api from './api';

export const getEnrollmentsByLesson = async (lessonId) => {
    const { data } = await api.get(`/api/lesson-enrollments/by-lesson/${lessonId}`);
    return data;
};
