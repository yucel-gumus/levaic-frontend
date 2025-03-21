import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { membershipService, clinicService } from '../../services/api';
import { formatApiError, formatISODateToLocalDate } from '../../services/utils';
import MemberForm from '../../components/membership/MemberForm';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { validateMemberForm } from '../../constants';
import '../../components/Membership.css';

/**
 * Üye düzenleme sayfası bileşeni
 * @returns {JSX.Element}
 */
const MembershipEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [memberDataError, setMemberDataError] = useState(null);

  // Üye ve klinik verilerini yükle
  const fetchData = useCallback(async () => {
    try {
      setInitialLoading(true);
      setError(null);
      setMemberDataError(null);

      // Klinik verilerini getir - bunu önce yapıyoruz çünkü üye verisine bağlı değil
      let clinicsData = [];
      try {
        const clinicsResponse = await clinicService.getClinics();
        
        if (clinicsResponse.data && clinicsResponse.data.length > 0) {
          clinicsData = clinicsResponse.data;
          setClinics(clinicsData);
        } else {
          setClinics([]);
        }
      } catch (clinicError) {
        setClinics([]);
      }

      // Üye detaylarını getir
      try {
        const memberResponse = await membershipService.getMember(id);
        
        if (memberResponse && memberResponse.data) {
          let memberData = memberResponse.data;
          
          // Tarih formatını düzenle
          if (memberData.dogum_tarihi) {
            memberData.dogum_tarihi = formatISODateToLocalDate(memberData.dogum_tarihi);
          }

          // Klinik ID'sini string formatına çevir
          if (memberData.klinik && memberData.klinik._id) {
            memberData.klinik = memberData.klinik._id;
          }

          setMember(memberData);
          setFormData(memberData);
        } else {
          setMemberDataError('Üye verisi alınamadı. Sunucu boş bir yanıt döndürdü.');
        }
      } catch (memberError) {
        setMemberDataError(formatApiError(memberError));
      }

      // Klinik verisi boş ise uyarı göster
      if (clinicsData.length === 0) {
        setError('Klinik verisi bulunamadı. Lütfen önce klinik ekleyin.');
      }
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setInitialLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    const validationErrors = validateMemberForm(formData);
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      return;
    }
    
    try {
      setLoading(true);
      await membershipService.updateMember(id, formData);
      navigate('/uyelik');
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="membership-container">
        <LoadingSpinner message="Üye bilgileri yükleniyor..." />
      </div>
    );
  }

  // Üye verisi alınamadıysa hata göster
  if (memberDataError) {
    return (
      <div className="membership-container">
        <ErrorAlert 
          message={`Üye bilgileri alınamadı: ${memberDataError}`}
          type="error"
          title="Üye Verisi Yüklenemedi"
          onRetry={fetchData}
          onBack={() => navigate('/uyelik')}
          backText="Üyelik Listesine Dön"
        />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="membership-container">
        <ErrorAlert 
          message={`Üye ID: ${id} - Bu ID'ye sahip üye bulunamadı veya erişim izniniz yok.`}
          type="warning"
          title="Üye Bulunamadı"
          onBack={() => navigate('/uyelik')}
          backText="Üyelik Listesine Dön"
        />
      </div>
    );
  }

  // Klinik bulunamadığında gösterilecek hata
  if (clinics.length === 0) {
    return (
      <div className="membership-container">
        <PageHeader title={`Üye Düzenle: ${formData.ad} ${formData.soyad}`} />
        <ErrorAlert 
          message="Klinik verileri bulunamadı. Düzenleme yapabilmek için en az bir klinik gereklidir."
          onRetry={fetchData}
          onBack={() => navigate('/klinik/create')}
          backText="Yeni Klinik Ekle"
        />
      </div>
    );
  }

  return (
    <div className="membership-container">
      <PageHeader 
        title={`Üye Düzenle: ${formData.ad} ${formData.soyad}`} 
      />

      <div className="clinic-content">
        <MemberForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          clinics={clinics}
          loading={loading}
          error={error}
          isEditMode={true}
        />
      </div>
    </div>
  );
};

export default MembershipEdit; 