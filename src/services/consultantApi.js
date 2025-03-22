import { toast } from 'react-hot-toast';
import { createBaseService } from './api';

// Danışman servisi oluştur
const consultantService = createBaseService('consultants');

// Tüm danışmanları getir
const getConsultants = async () => {
  try {
    const response = await consultantService.getAll();
    return response;
  } catch (error) {
    toast.error('Danışmanlar yüklenirken bir hata oluştu');
    throw error;
  }
};

// Belirli bir kliniğe ait danışmanları getir
const getConsultantsByClinic = async (clinicId) => {
  try {
    const response = await consultantService.getAll();
    // Gelen verileri filtreleme
    if (response && response.data) {
     
      
      const filteredData = response.data.filter(consultant => {
        // Danışmanın klinik bilgisinin farklı formatlarını kontrol et
        if (!consultant.klinik) return false;
        
        const consultantClinicId = typeof consultant.klinik === 'object' 
          ? consultant.klinik._id 
          : consultant.klinik;
        
       
        return consultantClinicId === clinicId;
      });
      
      return {
        ...response,
        data: filteredData
      };
    }
    return response;
  } catch (error) {
 
    toast.error('Klinik danışmanları yüklenirken bir hata oluştu');
    throw error;
  }
};

// Danışman detaylarını getir
const getConsultant = async (id) => {
  try {
    const response = await consultantService.getById(id);
    return response;
  } catch (error) {
    toast.error('Danışman bilgileri alınamadı');
    throw error;
  }
};

// Yeni danışman oluştur
const createConsultant = async (consultantData) => {
  try {
    const response = await consultantService.create(consultantData);
    toast.success('Danışman başarıyla oluşturuldu');
    return response;
  } catch (error) {
    toast.error('Danışman oluşturulurken bir hata oluştu');
    throw error;
  }
};

// Danışman güncelle
const updateConsultant = async (id, consultantData) => {
  try {
    const response = await consultantService.update(id, consultantData);
    toast.success('Danışman başarıyla güncellendi');
    return response;
  } catch (error) {
    toast.error('Danışman güncellenirken bir hata oluştu');
    throw error;
  }
};

// Danışman sil
const deleteConsultant = async (id) => {
  try {
    const response = await consultantService.delete(id);
    toast.success('Danışman başarıyla silindi');
    return response;
  } catch (error) {
    toast.error('Danışman silinirken bir hata oluştu');
    throw error;
  }
};

export {
  consultantService,
  getConsultants,
  getConsultant,
  createConsultant,
  updateConsultant,
  deleteConsultant,
  getConsultantsByClinic
}; 