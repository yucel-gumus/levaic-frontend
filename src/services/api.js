import axios from 'axios';

// Ana API yapılandırması - her zaman doğru URL'yi kullan
const isProduction = process.env.NODE_ENV === 'production';
// Production ortamında KESINLIKLE relative path kullan
const API_URL = isProduction ? '/api' : 'http://localhost:5005/api';

// Zorunlu loglar (debugging için)
console.log('---------------------------------------------');
console.log('CURRENT ENVIRONMENT:', process.env.NODE_ENV);
console.log('IS PRODUCTION?', isProduction);
console.log('API URL:', API_URL);
console.log('---------------------------------------------');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token ekleme
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Klinik servisleri
const clinicService = {
  // Tüm klinikleri getir
  getClinics: () => api.get('/clinics'),
  
  // Klinik detaylarını getir
  getClinic: (id) => api.get(`/clinics/${id}`),
  
  // Yeni klinik oluştur
  createClinic: (clinicData) => api.post('/clinics', clinicData),
  
  // Klinik güncelle
  updateClinic: (id, clinicData) => api.put(`/clinics/${id}`, clinicData),
  
  // Klinik sil
  deleteClinic: (id) => api.delete(`/clinics/${id}`),
  
  // Bugünkü istatistikleri getir
  getTodayStats: () => api.get('/clinics/stats/today')
};

// Üyelik servisleri
const membershipService = {
  // Tüm üyeleri getir
  getMembers: () => api.get('/members'),
  
  // Üye detaylarını getir
  getMember: async (id) => {
    try {
      const response = await api.get(`/members/${id}`);
      return response;
    } catch (error) {
      // Re-throw the error to be handled by the component
      throw error;
    }
  },
  
  // Yeni üye oluştur
  createMember: (memberData) => api.post('/members', memberData),
  
  // Üye güncelle
  updateMember: (id, memberData) => api.put(`/members/${id}`, memberData),
  
  // Üye sil
  deleteMember: (id) => api.delete(`/members/${id}`)
};

// Danışman servisleri
const consultantService = {
  // Tüm danışmanları getir
  getConsultants: () => api.get('/consultants'),
  
  // Danışman detaylarını getir
  getConsultant: async (id) => {
    try {
      const response = await api.get(`/consultants/${id}`);
      return response;
    } catch (error) {
      // Re-throw the error to be handled by the component
      throw error;
    }
  },
  
  // Yeni danışman oluştur
  createConsultant: (consultantData) => api.post('/consultants', consultantData),
  
  // Danışman güncelle
  updateConsultant: (id, consultantData) => api.put(`/consultants/${id}`, consultantData),
  
  // Danışman sil
  deleteConsultant: (id) => api.delete(`/consultants/${id}`)
};

export { clinicService, membershipService, consultantService, api }; 