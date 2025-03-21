import React from 'react';
import { Link } from 'react-router-dom';
import ClinicForm from './ClinicForm';
import './Clinic.css';

/**
 * Klinik sayfaları için genel bileşen
 * @param {Object} props 
 * @param {string} props.title - Sayfanın başlığı
 * @param {Object} props.clinic - Klinik verisi
 * @param {Function} props.setClinic - Klinik verisini güncelleyen fonksiyon
 * @param {Function} props.handleSubmit - Form gönderildiğinde çalışacak fonksiyon
 * @param {boolean} props.isLoading - Yükleme durumu
 * @param {string} props.error - Hata mesajı
 * @param {Function} props.onCancel - İptal butonuna tıklandığında çalışacak fonksiyon
 * @param {string} props.submitButtonText - Gönder butonu metni
 * @returns {JSX.Element}
 */
const ClinicPage = ({ 
  title,
  clinic, 
  setClinic, 
  handleSubmit, 
  isLoading, 
  error, 
  onCancel, 
  submitButtonText = 'Kaydet' 
}) => {
  // Yükleme gösteriliyor
  if (isLoading && !submitButtonText.includes('Kaydediliyor')) {
    return (
      <div className="clinic-container">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="clinic-container">
      <div className="clinic-header">
        <h1>{title}</h1>
        <Link to="/klinik" className="btn btn-secondary">
          Geri Dön
        </Link>
      </div>

      <div className="clinic-content">
        {error && (
          <div className="alert alert-danger mb-4">{error}</div>
        )}
        
        <div className="clinic-form-container">
          <ClinicForm 
            clinic={clinic}
            onChange={setClinic}
            onSubmit={handleSubmit}
            submitButtonText={submitButtonText}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicPage; 