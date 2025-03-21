import React from 'react';

/**
 * Yükleme durumunu gösteren bileşen
 * @param {Object} props - Bileşen özellikleri
 * @param {string} props.message - Yükleme mesajı
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ message = 'Yükleniyor...' }) => {
  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Yükleniyor...</span>
      </div>
      <p className="mt-2 mb-0">{message}</p>
    </div>
  );
};

export default LoadingSpinner; 