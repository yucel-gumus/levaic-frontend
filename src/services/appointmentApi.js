import { toast } from 'react-hot-toast';
import { createBaseService } from './api';

// Randevu servisi oluştur
const appointmentService = createBaseService('appointments');

// Tüm randevuları getir
const getAppointments = async () => {
  try {
    const response = await appointmentService.getAll();
    return response;
  } catch (error) {
    toast.error('Randevular alınamadı');
    throw error;
  }
};

// Belirli bir randevuyu getir
const getAppointment = async (id) => {
  try {
    const response = await appointmentService.getById(id);
    return response;
  } catch (error) {
    toast.error('Randevu bilgileri alınamadı');
    throw error;
  }
};

// Yeni randevu oluştur
const createAppointment = async (appointmentData) => {
  try {
    if (!appointmentData.klinik || 
        !appointmentData.danismanlar || 
        !appointmentData.danismanlar.length || 
        !appointmentData.hizmet || 
        !appointmentData.uye || 
        !appointmentData.tarih) {
      toast.error('Tüm alanlar zorunludur');
      throw new Error('Tüm alanlar zorunludur');
    }
    
    const response = await appointmentService.create(appointmentData);
    toast.success('Randevu başarıyla oluşturuldu');
    return response;
  } catch (error) {
    toast.error(error.message || 'Randevu oluşturulamadı');
    throw error;
  }
};

// Randevu güncelle
const updateAppointment = async (id, appointmentData) => {
  try {
    if (!appointmentData.klinik || 
        !appointmentData.danismanlar || 
        !appointmentData.danismanlar.length || 
        !appointmentData.hizmet || 
        !appointmentData.uye || 
        !appointmentData.tarih) {
      toast.error('Tüm alanlar zorunludur');
      throw new Error('Tüm alanlar zorunludur');
    }
    
    const response = await appointmentService.update(id, appointmentData);
    toast.success('Randevu başarıyla güncellendi');
    return response;
  } catch (error) {
    toast.error(error.message || 'Randevu güncellenemedi');
    throw error;
  }
};

// Randevu sil
const deleteAppointment = async (id) => {
  try {
    const response = await appointmentService.delete(id);
    toast.success('Randevu başarıyla silindi');
    return response;
  } catch (error) {
    toast.error('Randevu silinemedi');
    throw error;
  }
};

export {
  appointmentService,
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
}; 