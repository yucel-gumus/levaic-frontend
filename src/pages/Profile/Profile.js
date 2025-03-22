import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Initialize form data with user data
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        role: parsedUser.role || 'user',
        phone: parsedUser.phone || '',
        avatar: parsedUser.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    // Reset password fields when toggling edit mode
    if (!isEditing) {
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords if the user is trying to change them
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error('Mevcut şifrenizi girmelisiniz');
        return;
      }
      
      if (formData.newPassword.length < 6) {
        toast.error('Yeni şifre en az 6 karakter olmalıdır');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Yeni şifreler eşleşmiyor');
        return;
      }
    }
    
    setLoading(true);
    
    // In a real app, this would make an API call to update profile
    setTimeout(() => {
      // Update user in localStorage (mock update)
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setLoading(false);
      toast.success('Profil başarıyla güncellendi');
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 1000);
  };

  if (!user) {
    return <div className="profile-loading">Yükleniyor...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profil Bilgilerim</h1>
        <button 
          className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`} 
          onClick={toggleEdit}
        >
          {isEditing ? 'İptal' : 'Düzenle'}
        </button>
      </div>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <img 
              src={user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'} 
              alt={user.name} 
            />
            {isEditing && (
              <button className="change-avatar-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Resim Yükle
              </button>
            )}
          </div>
          
          <div className="profile-info">
            {!isEditing ? (
              <>
                <div className="info-group">
                  <label>Ad Soyad</label>
                  <p>{user.name}</p>
                </div>
                <div className="info-group">
                  <label>E-posta</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-group">
                  <label>Telefon</label>
                  <p>{user.phone || '—'}</p>
                </div>
                <div className="info-group">
                  <label>Hesap Türü</label>
                  <p>{user.role === 'admin' ? 'Yönetici' : user.role === 'clinic' ? 'Klinik' : 'Danışman'}</p>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Ad Soyad</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">E-posta</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <h3 className="section-title">Şifre Değiştir</h3>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Mevcut Şifre</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">Yeni Şifre</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Yeni Şifre Tekrar</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={toggleEdit}
                  >
                    İptal
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 