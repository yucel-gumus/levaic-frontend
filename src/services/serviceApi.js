import { toast } from 'react-hot-toast';
import { createBaseService } from './api';

// Ana servis objesini oluştur
const serviceService = createBaseService('services');

// Özel fonksiyonlar
const getServicesByClinic = async (clinicId) => {
  try {
    const response = await serviceService.getAll();
    // Gelen verileri filtreleme
    if (response && response.data) {
      return {
        ...response,
        data: response.data.filter(service => 
          service.klinik && service.klinik._id === clinicId)
      };
    }
    return response;
  } catch (error) {
    toast.error('Klinik servisleri yüklenirken bir hata oluştu');
    throw error;
  }
};

/**
 * Belirli bir hizmeti ID'ye göre getir
 * @param {string} id Hizmet ID'si
 * @returns {Promise<Object>} Hizmet nesnesi
 */
const getService = async (id) => {
  try {
    const response = await serviceService.getById(id);
    return response;
  } catch (error) {
    toast.error('Hizmet bilgileri alınamadı');
    throw error;
  }
};

/**
 * Yeni hizmet oluştur
 * @param {Object} serviceData Hizmet verileri
 * @returns {Promise<Object>} Oluşturulan hizmet
 */
const createService = async (serviceData) => {
  try {
    const response = await serviceService.create(serviceData);
    toast.success('Hizmet başarıyla oluşturuldu');
    return response;
  } catch (error) {
    toast.error('Hizmet oluşturulurken bir hata oluştu');
    throw error;
  }
};

/**
 * Hizmet güncelle
 * @param {string} id Hizmet ID'si
 * @param {Object} serviceData Güncellenecek hizmet verileri
 * @returns {Promise<Object>} Güncellenmiş hizmet
 */
const updateService = async (id, serviceData) => {
  try {
    const response = await serviceService.update(id, serviceData);
    toast.success('Hizmet başarıyla güncellendi');
    return response;
  } catch (error) {
    toast.error('Hizmet güncellenirken bir hata oluştu');
    throw error;
  }
};

/**
 * Hizmet sil
 * @param {string} id Silinecek hizmet ID'si
 * @returns {Promise<Object>} Silme işlemi sonucu
 */
const deleteService = async (id) => {
  try {
    const response = await serviceService.delete(id);
    toast.success('Hizmet başarıyla silindi');
    return response;
  } catch (error) {
    toast.error('Hizmet silinirken bir hata oluştu');
    throw error;
  }
};

/**
 * Danışmana ait hizmetleri getir
 * @param {string} consultantId Danışman ID'si
 * @returns {Promise<Object>} Danışmanın hizmetleri
 */
const getServicesByConsultant = async (consultantId) => {
  try {
    
    // Önce tüm hizmetleri alıyoruz
    const response = await serviceService.getAll();
    
    // Gelen verileri filtreleme
    if (response?.data?.length > 0) {
      // Eğer consultantId string değilse, düzeltme yap
      const normalizedConsultantId = consultantId && typeof consultantId === 'object' 
        ? consultantId._id 
        : consultantId;
      
      
      // Hizmetleri filtrele
      const filteredData = response.data.filter(service => {
        
        // Danışmanlar alanını kontrol et
        if (!service.danismanlar) {
          return false;
        }
        
        if (!Array.isArray(service.danismanlar)) {
          return false;
        }
        
      
        // Danışman ID eşleşmesini kontrol et
        const hasConsultant = service.danismanlar.some(danisman => {
          if (!danisman) {
            return false;
          }
          
          // Danışman ID'sini normalize et
          const danismanId = typeof danisman === 'object' 
            ? danisman._id 
            : danisman;
          
          // String olarak karşılaştırma yapalım (MongoDB bazen ObjectID kullanıyor)
          const match = String(danismanId) === String(normalizedConsultantId);
          return match;
        });
        
        
        return hasConsultant;
      });
      
      
      return {
        ...response,
        data: filteredData
      };
    }
    
    return response;
  } catch (error) {
    console.error("Danışman hizmetleri yüklenirken hata:", error);
    toast.error('Danışman hizmetleri yüklenirken bir hata oluştu');
    throw error;
  }
};

export { 
  serviceService,
  getService,
  createService,
  updateService,
  deleteService,
  getServicesByClinic,
  getServicesByConsultant
};