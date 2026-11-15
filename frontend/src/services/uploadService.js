// src/services/uploadService.js
import api from './api';

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  
  // 🎯 On ajoute "/admin" devant "/upload"
  const { data } = await api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return data.url;
}