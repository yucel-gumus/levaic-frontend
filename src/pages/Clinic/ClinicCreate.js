import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clinicService } from '../../services/api';
import ClinicPage from '../../components/ClinicPage';
import { EMPTY_CLINIC } from '../../constants';

/**
 * Yeni klinik oluşturma sayfası bileşeni
 * @returns {JSX.Element}
 */
const ClinicCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clinic, setClinic] = useState({...EMPTY_CLINIC});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await clinicService.createClinic(clinic);
      navigate('/klinik');
    } catch (err) {
      setError('Klinik kaydedilirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClinicPage
      title="Yeni Klinik Ekle"
      clinic={clinic}
      setClinic={setClinic}
      handleSubmit={handleSubmit}
      isLoading={loading}
      error={error}
      submitButtonText={loading ? 'Kaydediliyor...' : 'Kaydet'}
      onCancel={() => navigate('/klinik')}
    />
  );
};

export default ClinicCreate; 