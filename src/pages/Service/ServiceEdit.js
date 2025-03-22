import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ServicePage from '../../components/ServicePage';
import { getService, updateService } from '../../services/serviceApi';
import { getClinics } from '../../services/clinicApi';
import { getConsultants } from '../../services/consultantApi';

const ServiceEdit = () => {
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // loadService fonksiyonu useCallback ile tekrar oluşumunu engelleme
  const loadService = useCallback(async () => {
    if (!id) {
      setError('Geçersiz hizmet ID');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const [serviceData, clinicsData, consultantsData] = await Promise.all([
        getService(id),
        getClinics(),
        getConsultants()
      ]);

      // Servis verisinin doğru formatta olduğunu kontrol et
      if (!serviceData || !serviceData.data) {
        throw new Error('Hizmet verisi alınamadı');
      }

      const serviceResponseData = serviceData.data;
      
      // Klinik ve danışman seçeneklerini hazırla
      const klinikOptions = clinicsData.data ? clinicsData.data.map(clinic => ({
        value: clinic._id,
        label: clinic.ad
      })) : [];

      const danismanOptions = consultantsData.data ? consultantsData.data.map(consultant => ({
        value: consultant._id,
        label: `${consultant.ad} ${consultant.soyad}`
      })) : [];
      
      // Klinik ve danışman verilerini ID'lere dönüştür
      const kliniklerIds = Array.isArray(serviceResponseData.klinikler) 
        ? serviceResponseData.klinikler.map(klinik => klinik._id || klinik)
        : [];
        
      const danismanlarIds = Array.isArray(serviceResponseData.danismanlar)
        ? serviceResponseData.danismanlar.map(danisman => danisman._id || danisman)
        : [];
      
      // Hizmet nesnesini düzenle
      const formattedService = {
        ...serviceResponseData,
        klinikler: kliniklerIds,
        danismanlar: danismanlarIds,
        klinikOptions,
        danismanOptions
      };
      
      setService(formattedService);
    } catch (err) {
      setError('Hizmet bilgileri yüklenirken bir hata oluştu');
      toast.error('Veri yükleme hatası');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Component mount olduğunda veya id değiştiğinde verileri yükle
  useEffect(() => {
    loadService();
  }, [loadService]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!service) {
      toast.error('Güncellenecek veri bulunamadı');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // API'ye gönderilecek verileri hazırla (gereksiz alanları çıkar)
      const { klinikOptions, danismanOptions, _id, __v, createdAt, updatedAt, ...submitData } = service;
      
      await updateService(id, submitData);
      toast.success('Hizmet başarıyla güncellendi');
      navigate('/hizmet');
    } catch (err) {
      setError('Hizmet güncellenirken bir hata oluştu');
      toast.error('Güncelleme hatası');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/hizmet');
  };

  if (isLoading && !service) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error && !service) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button 
          className="btn btn-link" 
          onClick={loadService}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <ServicePage
      title="Hizmet Düzenle"
      service={service}
      setService={setService}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      isLoading={isLoading}
      error={error}
      submitButtonText="Güncelle"
    />
  );
};

export default ServiceEdit; 