import { api } from './api';

// localStorage ile token yönetimi
const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// localStorage'dan token alma
const getToken = () => {
  return localStorage.getItem('token');
};

// Kullanıcı kaydı
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error?.message || error.message || 'Bir hata oluştu';
  }
};

// Kullanıcı girişi
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success) {
      // Token ve kullanıcı bilgilerini kaydet
      const { token, ...userWithoutToken } = response.data.data;
      setToken(token);
      localStorage.setItem('user', JSON.stringify(userWithoutToken));
      localStorage.setItem('isAuthenticated', 'true');
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.error?.message || error.message || 'Bir hata oluştu';
  }
};

// Kullanıcı çıkışı
const logout = () => {
  // Tüm auth verilerini temizle
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('rememberMe');
};

// Profil bilgilerini getir
const getProfile = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token bulunamadı');
    }
    
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error?.message || error.message || 'Bir hata oluştu';
  }
};

// Profil bilgilerini güncelle
const updateProfile = async (userData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token bulunamadı');
    }
    
    const response = await api.put('/auth/profile', userData);
    
    if (response.data.success) {
      // Güncel kullanıcı bilgilerini kaydet
      const { token: newToken, ...userWithoutToken } = response.data.data;
      setToken(newToken);
      localStorage.setItem('user', JSON.stringify(userWithoutToken));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.error?.message || error.message || 'Bir hata oluştu';
  }
};

// Şifre sıfırlama isteği
const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error?.message || error.message || 'Bir hata oluştu';
  }
};

// Şifre sıfırlama
const resetPassword = async (resetToken, password) => {
  try {
    const response = await api.post(`/auth/reset-password/${resetToken}`, { password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error?.message || error.message || 'Bir hata oluştu';
  }
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  getToken,
  setToken
};

export default authService; 