import React from 'react';

/**
 * Hata mesajlarını gösteren bileşen
 * @param {Object} props - Bileşen özellikleri
 * @param {string} props.message - Hata mesajı
 * @param {Function} props.onRetry - Yeniden deneme fonksiyonu
 * @param {Function} props.onBack - Geri dönme fonksiyonu
 * @param {string} props.backText - Geri dönme düğmesi metni
 * @param {string} props.type - Uyarı türü (danger, warning, info)
 * @returns {JSX.Element}
 */
const ErrorAlert = ({ 
  message, 
  onRetry, 
  onBack, 
  backText = 'Geri Dön', 
  type = 'danger',
  title = 'Hata!'
}) => {
  return (
    <div className={`alert alert-${type}`}>
      <h4 className="alert-heading">{title}</h4>
      <p className="white-space-pre-line">{message}</p>
      
      {(onRetry || onBack) && (
        <>
          <hr />
          <div className="d-flex gap-2">
            {onBack && (
              <button 
                className="btn btn-primary" 
                onClick={onBack}
              >
                {backText}
              </button>
            )}
            
            {onRetry && (
              <button 
                className="btn btn-secondary" 
                onClick={onRetry}
              >
                Tekrar Dene
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ErrorAlert; 