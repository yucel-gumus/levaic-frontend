import { api } from './api';

// Tüm klinikleri getir
export const getClinics = async () => {
  const response = await api.get('/clinics');
  return response.data;
};

// Klinik detaylarını getir
export const getClinic = async (id) => {
  const response = await api.get(`/clinics/${id}`);
  return response.data;
};

// Yeni klinik oluştur
export const createClinic = async (clinicData) => {
  const response = await api.post('/clinics', clinicData);
  return response.data;
};

// Klinik güncelle
export const updateClinic = async (id, clinicData) => {
  const response = await api.put(`/clinics/${id}`, clinicData);
  return response.data;
};

// Klinik sil
export const deleteClinic = async (id) => {
  const response = await api.delete(`/clinics/${id}`);
  return response.data;
}; 