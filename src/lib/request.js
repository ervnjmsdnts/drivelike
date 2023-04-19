import axios from 'axios';

const request = axios.create({ baseURL: 'http://localhost:8000/api/v1' });

request.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default request;
