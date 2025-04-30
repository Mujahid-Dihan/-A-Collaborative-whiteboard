import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export const signup = (data) => API.post('/auth/signup', data);
export const verifyEmail = (data) => API.post('/auth/verify-email', data);
export const login = (data) => API.post('/auth/login', data);
