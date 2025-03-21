import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { consultantService, clinicService } from '../../services/api';
import { formatISODateToLocalDate, formatApiError } from '../../services/utils';
import { validateConsultantForm } from '../../constants';
import ConsultantForm from '../../components/consultant/ConsultantForm';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import '../../components/Consultant.css';

/**
 * Danışman düzenleme sayfası bileşeni
 * @returns {JSX.Element}
 */
const ConsultantEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [consultant, setConsultant] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Danışman bilgilerini yükle
  const fetchConsultant = useCallback(async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const [consultantResponse, clinicsResponse] = await Promise.all([
        consultantService.getConsultant(id),
        clinicService.getClinics()
      ]);
      
      if (clinicsResponse.data && clinicsResponse.data.length > 0) {
        setClinics(clinicsResponse.data);
      } else {
        setClinics([]);
        setError('Klinik verisi bulunamadı. Lütfen önce klinik ekleyin.');
      }
      
      const consultantData = consultantResponse.data;
      
      // API'den gelen verileri formatlama
      const formattedConsultant = {
        ...consultantData,
        dogum_tarihi: formatISODateToLocalDate(consultantData.dogum_tarihi),
        klinik: consultantData.klinik._id
      };
      
      setConsultant(formattedConsultant);
      setFormData(formattedConsultant);
    } catch (err) {
      console.error('Danışman verileri yüklenirken hata:', err);
      setError(`Danışman bilgileri yüklenirken bir hata oluştu: ${formatApiError(err)}`);
    } finally {
      setInitialLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchConsultant();
  }, [fetchConsultant]);

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
      await consultantService.updateConsultant(id, formData);
      navigate('/danisman');
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="consultant-container">
        <LoadingSpinner message="Danışman verileri yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="consultant-container">
      <PageHeader 
        title={`Danışman Düzenle: ${consultant?.ad} ${consultant?.soyad}`} 
      />

      <div className="consultant-content">
        {error && !formData ? (
          <ErrorAlert 
            message={error}
            onRetry={fetchConsultant}
          />
        ) : (
          formData && (
            <ConsultantForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              clinics={clinics}
              loading={loading}
              error={error}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ConsultantEdit; 