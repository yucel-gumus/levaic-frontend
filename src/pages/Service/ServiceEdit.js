import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ServicePage from '../../components/ServicePage';
import { getService, updateService } from '../../services/serviceApi';
import { getClinics } from '../../services/clinicApi';
import { getConsultants } from '../../services/consultantApi';

const ServiceEdit = () => {
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const [serviceData, clinicsData, consultantsData] = await Promise.all([
        getService(id),
        getClinics(),
        getConsultants()
      ]);

      const klinikOptions = clinicsData.map(clinic => ({
        value: clinic._id,
        label: clinic.ad
      }));

      const danismanOptions = consultantsData.map(consultant => ({
        value: consultant._id,
        label: `${consultant.ad} ${consultant.soyad}`
      }));

      setService({
        ...serviceData,
        klinikOptions,
        danismanOptions
      });
      setIsLoading(false);
    } catch (err) {
      setError('Hizmet yüklenirken bir hata oluştu');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await updateService(id, service);
      toast.success('Hizmet başarıyla güncellendi');
      navigate('/hizmet');
    } catch (err) {
      setError(err.response?.data?.message || 'Hizmet güncellenirken bir hata oluştu');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/hizmet');
  };

  if (!service && isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <ServicePage
      title="Hizmet Düzenle"
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

export default ServiceEdit; 