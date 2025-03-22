import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clinicService } from '../../services/api';
import { createConsultant } from '../../services/consultantApi';
import { formatApiError } from '../../services/utils';
import { EMPTY_CONSULTANT, validateConsultantForm } from '../../constants';
import ConsultantForm from '../../components/consultant/ConsultantForm';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import '../../components/Consultant.css';

/**
 * Yeni danışman oluşturma sayfası bileşeni
 * @returns {JSX.Element}
 */
const ConsultantCreate = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clinicsLoading, setClinicsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({...EMPTY_CONSULTANT});

  // Klinikleri yükle
  const fetchClinics = useCallback(async () => {
    setClinicsLoading(true);
    try {
      const response = await clinicService.getAll();
      if (response.data && response.data.length > 0) {
        setClinics(response.data);
      } else {
        setClinics([]);
        setError('Klinik verisi bulunamadı. Lütfen önce klinik ekleyin.');
      }
    } catch (err) {
      setError('Klinikler yüklenemedi: ' + formatApiError(err));
      setClinics([]);
    } finally {
      setClinicsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClinics();
  }, [fetchClinics]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Form validasyonu
    const validationErrors = validateConsultantForm(formData);
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      return;
    }
    
    try {
      setLoading(true);
      await createConsultant(formData);
      navigate('/danisman');
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (clinicsLoading) {
    return (
      <div className="consultant-container">
        <LoadingSpinner message="Klinik verileri yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="consultant-container">
      <PageHeader 
        title="Yeni Danışman Ekle" 
      />

      <div className="consultant-content">
        {error && clinics.length === 0 ? (
          <ErrorAlert 
            message="Klinik verileri bulunamadı. Yeni danışman eklemek için en az bir klinik gereklidir."
            onRetry={fetchClinics}
            onBack={() => navigate('/klinik/create')}
            backText="Yeni Klinik Ekle"
          />
        ) : (
          <ConsultantForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            clinics={clinics}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default ConsultantCreate; 