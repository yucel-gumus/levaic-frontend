import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../../services/authService';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/dashboard');
    }
    
    // Check if user just registered
    if (location.state?.registered) {
      setSuccess('Kaydınız başarıyla oluşturuldu. Lütfen giriş yapın.');
    }
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Gerçek API ile giriş yapma işlemi
      await authService.login(email, password);
      
      // Eğer "Beni hatırla" seçeneği işaretlendiyse
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      setLoading(false);
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
      navigate('/dashboard');
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      toast.error('Giriş başarısız: ' + err.toString());
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Levaic</h1>
          <p className="auth-tagline">Sağlık Yönetim Sistemi</p>
        </div>
        
        <div className="auth-form-container">
          <h2 className="auth-title">Hoş Geldiniz</h2>
          <p className="auth-subtitle">Hesabınızla giriş yapın</p>
          
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          
          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="E-posta adresinizi girin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <div className="password-input-container">
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="rememberMe">Beni hatırla</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Şifremi Unuttum
              </Link>
            </div>
            
            <button
              type="submit"
              className={`auth-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              Hesabınız yok mu? <Link to="/register">Kayıt olun</Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="auth-illustration">
        <div className="auth-illustration-content">
          <h2>Levaic Sağlık Yönetim Sistemi</h2>
          <p>
            Kliniğinizi yönetmek ve hasta hizmetlerinizi optimize etmek için
            gelişmiş çözümler sunan eksiksiz platform.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="auth-feature-text">
                <h3>Zaman Tasarrufu</h3>
                <p>Randevu ve kayıt işlemlerini otomatikleştirin</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <div className="auth-feature-text">
                <h3>Dijital Kayıtlar</h3>
                <p>Tüm hasta bilgilerini tek bir yerde saklayın</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
              </div>
              <div className="auth-feature-text">
                <h3>Analitik Raporlar</h3>
                <p>Klinik performansınızı detaylı metriklerle izleyin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 