import React from 'react';
import { Link } from 'react-router-dom';
import ServiceForm from './ServiceForm';
import './Service.css';

const ServicePage = ({ 
  title,
  service, 
  setService, 
  handleSubmit, 
  isLoading, 
  error, 
  onCancel, 
  submitButtonText = 'Kaydet' 
}) => {
  if (isLoading && !submitButtonText.includes('Kaydediliyor')) {
    return (
      <div className="service-container">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-container">
      <div className="service-header">
        <h1>{title}</h1>
        <Link to="/hizmet" className="btn btn-secondary">
          Geri Dön
        </Link>
      </div>

      <div className="service-content">
        {error && (
          <div className="alert alert-danger mb-4">{error}</div>
        )}
        
        <div className="service-form-container">
          <ServiceForm 
            service={service}
            onChange={setService}
            onSubmit={handleSubmit}
            submitButtonText={submitButtonText}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default ServicePage; 