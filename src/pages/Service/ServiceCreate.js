import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ServicePage from '../../components/ServicePage';
import { createService } from '../../services/serviceApi';
import { getClinics } from '../../services/clinicApi';
import { getConsultants } from '../../services/consultantApi';

const EMPTY_SERVICE = {
  hizmet_kategorisi: '',
  hizmet_adi: '',
  ucret: '',
  telemed_hizmeti: false,
  klinikler: [],
  danismanlar: [],
  sure: {
    saat: 0,
    dakika: 0
  },
  durum: 'Aktif',
  coklu_secim: false,
  klinikOptions: [],
  danismanOptions: []
};

const ServiceCreate = () => {
  const [service, setService] = useState(EMPTY_SERVICE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [clinicsData, consultantsData] = await Promise.all([
        getClinics(),
        getConsultants()
      ]);

      if (!clinicsData || !consultantsData) {
        throw new Error('Klinik veya danışman verileri alınamadı');
      }

      const klinikOptions = clinicsData.data ? clinicsData.data.map(clinic => ({
        value: clinic._id,
        label: clinic.ad
      })) : [];

      const danismanOptions = consultantsData.data ? consultantsData.data.map(consultant => ({
        value: consultant._id,
        label: `${consultant.ad} ${consultant.soyad}`
      })) : [];

      setService(prev => ({
        ...prev,
        klinikOptions,
        danismanOptions
      }));
    } catch (err) {
      setError('Seçenekler yüklenirken bir hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createService(service);
      toast.success('Hizmet başarıyla oluşturuldu');
      navigate('/hizmet');
    } catch (err) {
      setError(err.response?.data?.message || 'Hizmet oluşturulurken bir hata oluştu');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/hizmet');
  };

  return (
    <ServicePage
      title="Yeni Hizmet Ekle"
      service={service}
      setService={setService}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      onCancel={handleCancel}
      submitButtonText={isLoading ? 'Kaydediliyor...' : 'Kaydet'}
    />
  );
};

export default ServiceCreate; 