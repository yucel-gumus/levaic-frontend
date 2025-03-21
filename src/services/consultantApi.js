import { api } from './api';

// Tüm danışmanları getir
export const getConsultants = async () => {
  const response = await api.get('/consultants');
  return response.data;
};

// Danışman detaylarını getir
export const getConsultant = async (id) => {
  const response = await api.get(`/consultants/${id}`);
  return response.data;
};

// Yeni danışman oluştur
export const createConsultant = async (consultantData) => {
  const response = await api.post('/consultants', consultantData);
  return response.data;
};

// Danışman güncelle
export const updateConsultant = async (id, consultantData) => {
  const response = await api.put(`/consultants/${id}`, consultantData);
  return response.data;
};

// Danışman sil
export const deleteConsultant = async (id) => {
  const response = await api.delete(`/consultants/${id}`);
  return response.data;
}; 