import { api } from './api';

// Tüm hizmetleri getir
export const getServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

// Hizmet detaylarını getir
export const getService = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

// Yeni hizmet oluştur
export const createService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response.data;
};

// Hizmet güncelle
export const updateService = async (id, serviceData) => {
  const response = await api.put(`/services/${id}`, serviceData);
  return response.data;
};

// Hizmet sil
export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
}; 