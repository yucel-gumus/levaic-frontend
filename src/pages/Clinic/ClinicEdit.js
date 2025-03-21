import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clinicService } from '../../services/api';
import ClinicPage from '../../components/ClinicPage';
import { EMPTY_CLINIC } from '../../constants';

/**
 * Klinik düzenleme sayfası bileşeni
 * @returns {JSX.Element}
 */
const ClinicEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [clinic, setClinic] = useState({...EMPTY_CLINIC});

  // Klinik bilgilerini yükle
  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        setLoading(true);
        const response = await clinicService.getClinic(id);
        setClinic(response.data);
        setError(null);
      } catch (err) {
        setError('Klinik bilgileri yüklenirken bir hata oluştu: ' + err.message);
        console.error('Klinik bilgileri yüklenemedi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await clinicService.updateClinic(id, clinic);
      navigate('/klinik');
    } catch (err) {
      setError('Klinik güncellenirken bir hata oluştu: ' + err.message);
      console.error('Klinik güncellenemedi:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClinicPage
      title="Klinik Düzenle"
      clinic={clinic}
      setClinic={setClinic}
      handleSubmit={handleSubmit}
      isLoading={loading}
      error={error}
      submitButtonText={saving ? 'Kaydediliyor...' : 'Güncelle'}
      onCancel={() => navigate('/klinik')}
    />
  );
};

export default ClinicEdit; 