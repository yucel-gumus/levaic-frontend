import axios from 'axios';
import { toast } from 'react-hot-toast';

// API yapılandırması
const isProduction = process.env.NODE_ENV === 'production';
const API_URL = isProduction ? 'https://levaic-backend.vercel.app' : 'http://localhost:5005';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 saniye timeout
});

// Request interceptor for API calls
api.interceptors.request.use(
  config => {
    // Token ekle (varsa)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // İstek başlangıç zamanını kaydet (performans ölçümü için)
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  response => {
    // Yanıt süresini hesapla (performans ölçümü)
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    
    return response;
  },
  async error => {
    // Ağ hatası
    if (!error.response) {
      toast.error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
      return Promise.reject(error);
    }
    
    // 401 Unauthorized hatası - token yenileme için kullanılabilir
    if (error.response.status === 401) {
      // Mevcut sayfayı kaydet
      const currentPath = window.location.pathname;
      
      // Token temizle
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      
      // Eğer giriş sayfasında değilse yönlendir
      if (!currentPath.includes('/login')) {
        toast.error('Oturumunuz sona erdi, lütfen tekrar giriş yapın');
        window.location.href = `/login?redirect=${currentPath}`;
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Temel API servis oluşturucu
 * @param {string} basePath - Ana endpoint yolu
 * @returns {Object} CRUD işlemlerini içeren servis objesi
 */
const createBaseService = (basePath) => ({
  // Tüm kaynakları getir
  getAll: () => api.get(`/${basePath}`),
  
  // Belirli bir kaynağı ID'ye göre getir
  getById: async (id) => {
    try {
      const response = await api.get(`/${basePath}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Yeni kaynak oluştur
  create: (data) => api.post(`/${basePath}`, data),
  
  // Kaynak güncelle
  update: (id, data) => api.put(`/${basePath}/${id}`, data),
  
  // Kaynak sil
  delete: (id) => api.delete(`/${basePath}/${id}`)
});

// Klinik servisi
const clinicService = {
  ...createBaseService('clinics'),
  // Özel fonksiyonlar
  getTodayStats: () => api.get('/clinics/stats/today')
};

// Üyelik servisi
const membershipService = createBaseService('members');

// Danışman servisi
const consultantService = createBaseService('consultants');

export { clinicService, membershipService, consultantService, api, createBaseService }; 