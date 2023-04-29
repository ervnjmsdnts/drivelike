import request from './lib/request.js';

export const login = async (payload = {}) => {
  const response = await request.post('/authentication/login', payload);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await request.get('/users');
  return response.data;
};

export const createUser = async (payload = {}) => {
  const response = await request.post('/users/create-user', payload);
  return response.data;
};

export const createFolder = async (payload = {}) => {
  const response = await request.post('/folder/create-folder', payload);
  return response.data;
};

export const getFolders = async () => {
  const response = await request.get('/folder/get-folder-lists');
  return response.data;
};

export const getFolder = async (folderId) => {
  const response = await request.get(`/folder/${folderId}`);
  return response.data;
};

export const getModules = async () => {
  const response = await request.get('/modules/get-module-lists');
  return response.data;
};

export const createModule = async (payload = {}) => {
  const response = await request.post('/modules/create-module', payload);
  return response.data;
};
