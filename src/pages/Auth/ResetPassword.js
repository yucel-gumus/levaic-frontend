import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import './Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();

  // Token geçerliliğini kontrol et
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Geçersiz veya eksik sıfırlama token\'ı');
    }
  }, [token]);

  const validatePassword = (pass) => {
    if (pass.length < 6) {
      return 'Şifre en az 6 karakter olmalıdır';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form doğrulama
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Gerçek API'yi çağır
      await authService.resetPassword(token, password);
      
      setLoading(false);
      setSuccess(true);
      toast.success('Şifreniz başarıyla sıfırlandı');
      
      // 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        navigate('/login', { state: { passwordReset: true } });
      }, 3000);
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
          <h2 className="auth-title">Şifre Sıfırlama</h2>
          
          {!tokenValid ? (
            <div className="auth-error-container">
              <div className="auth-error-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3>Geçersiz Bağlantı</h3>
              <p>
                Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.
                Lütfen yeni bir şifre sıfırlama talebi oluşturun.
              </p>
              <div className="auth-footer">
                <Link to="/forgot-password" className="auth-button">
                  Şifremi Unuttum
                </Link>
              </div>
            </div>
          ) : !success ? (
            <>
              <p className="auth-subtitle">
                Yeni şifrenizi oluşturun
              </p>
              
              {error && <div className="auth-error">{error}</div>}
              
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="password">Yeni Şifre</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Yeni şifrenizi girin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Şifre Tekrar</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Şifrenizi tekrar girin"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
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
                    'Şifremi Yenile'
                  )}
                </button>
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
              <h3>Şifre Sıfırlama Başarılı</h3>
              <p>
                Şifreniz başarıyla değiştirildi.
                Birkaç saniye içinde giriş sayfasına yönlendirileceksiniz.
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
            Şifrenizi güvenli bir şekilde sıfırlayın ve hesabınıza yeniden erişin.
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
                <h3>Güçlü Şifre Kullanın</h3>
                <p>Hesabınızı korumak için güçlü ve benzersiz bir şifre oluşturun</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="auth-feature-text">
                <h3>Düzenli Yenileme</h3>
                <p>Güvenliğiniz için şifrenizi periyodik olarak değiştirin</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div className="auth-feature-text">
                <h3>Hesap Güvenliği</h3>
                <p>Verilerinizin güvenliği için hesabınızı koruyun</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 