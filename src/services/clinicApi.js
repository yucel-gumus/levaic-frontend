import { toast } from 'react-hot-toast';
import { createBaseService } from './api';

// Klinik servisi oluştur
const clinicService = createBaseService('clinics');

// Tüm klinikleri getir - ana servis fonksiyonunu kullanarak
const getClinics = async () => {
  try {
    const response = await clinicService.getAll();
    return response;
  } catch (error) {
    toast.error('Klinikler yüklenirken bir hata oluştu');
    throw error;
  }
};

// Klinik detaylarını getir
const getClinic = async (id) => {
  try {
    const response = await clinicService.getById(id);
    return response;
  } catch (error) {
    toast.error('Klinik bilgileri alınamadı');
    throw error;
  }
};

// Yeni klinik oluştur
const createClinic = async (clinicData) => {
  try {
    const response = await clinicService.create(clinicData);
    toast.success('Klinik başarıyla oluşturuldu');
    return response;
  } catch (error) {
    toast.error('Klinik oluşturulurken bir hata oluştu');
    throw error;
  }
};

// Klinik güncelle
const updateClinic = async (id, clinicData) => {
  try {
    const response = await clinicService.update(id, clinicData);
    toast.success('Klinik başarıyla güncellendi');
    return response;
  } catch (error) {
    toast.error('Klinik güncellenirken bir hata oluştu');
    throw error;
  }
};

// Klinik sil
const deleteClinic = async (id) => {
  try {
    const response = await clinicService.delete(id);
    toast.success('Klinik başarıyla silindi');
    return response;
  } catch (error) {
    toast.error('Klinik silinirken bir hata oluştu');
    throw error;
  }
};

// Bugünkü klinik istatistiklerini getir - özel fonksiyon
const getTodayStats = async () => {
  try {
    const response = await clinicService.getTodayStats();
    return response;
  } catch (error) {
    toast.error('İstatistikler yüklenirken bir hata oluştu');
    throw error;
  }
};

export {
  clinicService,
  getClinics,
  getClinic,
  createClinic,
  updateClinic,
  deleteClinic,
  getTodayStats
}; 