import axios from 'axios';

const request = axios.create({
  baseURL: 'https://filestoragewebapi-production.up.railway.app/api/v1'
});

request.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default request;
