import request from './lib/request.js';

export const login = async (payload = {}) => {
  const response = await request.post('/authentication/login', payload);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await request.get('/users/');
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

export const getModule = async (moduleId) => {
  const response = await request.get(`/modules/${moduleId}`);
  return response.data;
};

export const insertFile = async ({ payload = {}, file }) => {
  console.log('This is from actions: ', file);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('payload', JSON.stringify(payload));

  const response = await request.post('/files/insert-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};

export const getFiles = async () => {
  const response = await request.get('/files/get-file-lists');
  return response.data;
};

export const getFile = async (fileId) => {
  const response = await request.get(`/files/${fileId}`);
  return response.data;
};

export const updateModule = async ({ moduleId, payload = {} }) => {
  const response = await request.put(`/modules/${moduleId}`, payload);
  return response.data;
};

export const deleteFile = async (fileId) => {
  const response = await request.delete(`/files/${fileId}`);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await request.delete(`/users/${userId}`);
  return response.data;
};
