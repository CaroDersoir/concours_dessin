// appel API pour envoyer une évaluation
import api from './api';

export const sendEvaluation = (email, message) =>
    api.post('/contact/evaluation', {email, message});
