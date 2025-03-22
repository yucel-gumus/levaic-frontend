import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../../services/authService';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('E-posta adresi zorunludur');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Gerçek API'yi çağır
      await authService.forgotPassword(email);
      
      setLoading(false);
      setSuccess(true);
      toast.success('Şifre sıfırlama talimatları e-posta adresinize gönderildi');
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      toast.error('İşlem başarısız: ' + err.toString());
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
          <h2 className="auth-title">Şifremi Unuttum</h2>
          
          {!success ? (
            <>
              <p className="auth-subtitle">
                Şifrenizi sıfırlamak için e-posta adresinizi girin
              </p>
              
              {error && <div className="auth-error">{error}</div>}
              
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
                
                <button
                  type="submit"
                  className={`auth-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner"></span>
                  ) : (
                    'Şifremi Sıfırla'
                  )}
                </button>
                
                <div className="auth-footer">
                  <p>
                    <Link to="/login">Giriş sayfasına dön</Link>
                  </p>
                </div>
              </form>
            </>
          ) : (
            <div className="auth-success">
              <div className="auth-success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>E-posta Gönderildi</h3>
              <p>
                Şifre sıfırlama talimatları e-posta adresinize gönderildi.
                Lütfen gelen kutunuzu kontrol edin ve talimatlara uyun.
              </p>
              <div className="auth-footer">
                <Link to="/login" className="auth-button">
                  Giriş Sayfasına Dön
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="auth-illustration">
        <div className="auth-illustration-content">
          <h2>Levaic Sağlık Yönetim Sistemi</h2>
          <p>
            Şifrenizi sıfırlamak için e-posta adresinize talimatlar göndereceğiz.
            Güvenliğiniz bizim için önemlidir.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div className="auth-feature-text">
                <h3>Güvenli Erişim</h3>
                <p>Hesabınızı güvende tutmak için şifrenizi düzenli olarak değiştirin</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="auth-feature-text">
                <h3>Hızlı İşlem</h3>
                <p>Şifrenizi anında sıfırlayarak sisteme erişiminizi yeniden sağlayın</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M6 8h.01M6 12h.01M6 16h.01M10 8h8M10 12h8M10 16h8"></path>
                </svg>
              </div>
              <div className="auth-feature-text">
                <h3>Kolay Süreç</h3>
                <p>Birkaç basit adımda şifrenizi yenileyerek işlerinize devam edin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 