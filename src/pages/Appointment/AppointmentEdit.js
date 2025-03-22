import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AppointmentForm from '../../components/AppointmentForm';
import { getAppointment, updateAppointment } from '../../services/appointmentApi';
import { getConsultants, getConsultantsByClinic } from '../../services/consultantApi';
import { getClinics } from '../../services/clinicApi';
import { getMembers } from '../../services/memberApi';

const AppointmentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    klinik: '',
    danismanlar: [],
    hizmet: '',
    tarih: '',
    durum: '',
    uye: '',
  });
  const [clinics, setClinics] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadAppointment();
    loadClinics();
    loadConsultants();
    loadMembersData();
  }, [id]);

  const loadAppointment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Randevu yükleniyor, id:", id);
      const response = await getAppointment(id);
      
      if (response && response.data) {
        console.log("Gelen randevu verisi:", JSON.stringify(response.data));
        
        // Üye bilgisini işle
        const uyeBilgisi = response.data.uye;
        let uyeId = '';
        if (uyeBilgisi) {
          uyeId = typeof uyeBilgisi === 'object' ? uyeBilgisi._id : uyeBilgisi;
        }
        
        // Klinik bilgisini işle
        let klinikId = '';
        if (response.data.klinik) {
          klinikId = typeof response.data.klinik === 'object' ? response.data.klinik._id : response.data.klinik;
          console.log("Klinik ID:", klinikId);
        }
        
        // Hizmet bilgisini işle
        let hizmetId = '';
        if (response.data.hizmet) {
          hizmetId = typeof response.data.hizmet === 'object' ? response.data.hizmet._id : response.data.hizmet;
          console.log("Hizmet ID:", hizmetId);
        }
        
        // Danışman bilgisini doğru formata çevir
        let danismanIds = [];
        if (response.data.danismanlar && Array.isArray(response.data.danismanlar)) {
          danismanIds = response.data.danismanlar.map(d => {
            const danismanId = typeof d === 'object' ? d._id : d;
            console.log("Danışman dönüştürme:", JSON.stringify(d), "->", danismanId);
            return danismanId;
          });
          console.log("Danışman ID'leri:", danismanIds);
        } else {
          console.log("Danışmanlar dizisi yok veya geçersiz format:", response.data.danismanlar);
        }
        
        // İşlenmiş veriyi oluştur
        const processedData = {
          ...response.data,
          klinik: klinikId,
          hizmet: hizmetId,
          danismanlar: danismanIds,
          uye: uyeId
        };
        
        console.log("İşlenmiş randevu verisi:", processedData);
        setAppointment(processedData);
        
        // Üye verilerini yükle
        await loadMembers();
        
        // Klinik danışmanlarını yükle
        if (klinikId) {
          console.log("Klinik danışmanları yükleniyor, klinikId:", klinikId);
          await loadClinicConsultants(klinikId);
        }
        
        // Danışman hizmetlerini yükle
        if (danismanIds.length > 0) {
          const consultantId = danismanIds[0];
          console.log("İlk danışman ID'si ile hizmetler yükleniyor:", consultantId);
          
          try {
            const { getServicesByConsultant } = await import('../../services/serviceApi');
            console.log("getServicesByConsultant fonksiyonu import edildi");
            
            const servicesResponse = await getServicesByConsultant(consultantId);
            console.log("Danışmana ait hizmetler alındı, toplam:", servicesResponse?.data?.length || 0);
            
            if (servicesResponse?.data?.length > 0) {
              // Hizmet verilerini loglayalım
              servicesResponse.data.forEach((service, index) => {
                console.log(`Hizmet ${index + 1}:`, {
                  _id: service._id,
                  ad: service.ad,
                  hizmet_adi: service.hizmet_adi,
                  kategori: service.kategori,
                  hizmet_kategorisi: service.hizmet_kategorisi,
                  fiyat: service.fiyat,
                  ucret: service.ucret
                });
              });
              
              console.log("Hizmetler state'e ayarlanıyor, adet:", servicesResponse.data.length);
              setServices(servicesResponse.data);
              
              // Hizmet ID'si ile eşleşen hizmeti bul
              if (hizmetId) {
                const matchingService = servicesResponse.data.find(s => s._id === hizmetId);
                if (matchingService) {
                  console.log("Mevcut hizmet bulundu:", matchingService.hizmet_adi);
                } else {
                  console.warn("Mevcut hizmet ID'si ile eşleşen hizmet bulunamadı:", hizmetId);
                  // Hizmet bulunamadıysa, ilk danışmana ait tüm hizmetleri getir
                  console.log("Tüm hizmetler yüklenecek...");
                }
              }
            } else {
              console.log("Danışmana ait hizmet bulunamadı veya veri boş");
              setServices([]);
            }
          } catch (serviceErr) {
            console.error("Hizmet yükleme hatası:", serviceErr);
            setServices([]);
          }
        } else {
          console.log("Danışman bilgisi yok, hizmetler yüklenemiyor");
        }
      } else {
        console.error("Randevu verisi alınamadı:", response);
        setError('Randevu bilgileri alınamadı');
      }
    } catch (err) {
      console.error("Randevu yükleme hatası:", err);
      setError(err.response?.data?.message || 'Randevu bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadClinics = async () => {
    try {
      const response = await getClinics();
      if (response && response.data) {
        setClinics(response.data);
      } else {
        setClinics([]);
        setError('Klinik verileri yüklenemedi. Lütfen daha sonra tekrar deneyiniz.');
      }
    } catch (err) {
      setClinics([]);
      setError('Klinik verileri yüklenirken bir hata oluştu.');
    }
  };

  const loadConsultants = async () => {
    try {
      const response = await getConsultants();
      if (response && response.data) {
        setConsultants(response.data);
      } else {
        setConsultants([]);
        setError('Danışman verileri yüklenemedi. Lütfen daha sonra tekrar deneyiniz.');
      }
    } catch (err) {
      setConsultants([]);
      setError('Danışman verileri yüklenirken bir hata oluştu.');
    }
  };

  const loadConsultantServices = async (consultantId) => {
    if (!consultantId) {
      console.log("loadConsultantServices: consultantId yok");
      return;
    }
    
    console.log("loadConsultantServices çağrıldı, consultantId:", consultantId);
    
    try {
      const { getServicesByConsultant } = await import('../../services/serviceApi');
      console.log("getServicesByConsultant fonksiyonu import edildi");
      
      const response = await getServicesByConsultant(consultantId);
      console.log("Danışmana ait hizmetler alındı, toplam:", response?.data?.length || 0);
      
      if (response?.data?.length > 0) {
        // Hizmet verilerini loglayalım
        response.data.forEach((service, index) => {
          console.log(`Hizmet ${index + 1}:`, {
            _id: service._id,
            ad: service.ad,
            hizmet_adi: service.hizmet_adi,
            kategori: service.kategori,
            hizmet_kategorisi: service.hizmet_kategorisi,
            fiyat: service.fiyat,
            ucret: service.ucret
          });
        });
        
        console.log("Hizmetler state'e ayarlanıyor, adet:", response.data.length);
        setServices(response.data);
      } else {
        console.log("Hizmet verisi yok veya boş");
        setServices([]);
      }
    } catch (err) {
      console.error("Hizmet yükleme hatası:", err);
      setServices([]);
    }
  };

  const loadClinicConsultants = async (clinicId) => {
    if (!clinicId) return;
    
    try {
      const response = await getConsultantsByClinic(clinicId);
      if (response && response.data) {
        setConsultants(response.data);
      } else {
        setConsultants([]);
      }
    } catch (err) {
      setConsultants([]);
    }
  };

  const loadMembersData = async () => {
    try {
      const response = await getMembers();
      if (response && response.data) {
        setMembers(response.data);
      }
    } catch (err) {
      // Error handled silently
    }
  };

  const loadMembers = async () => {
    try {
      const response = await getMembers();
      if (response && response.data) {
        setMembers(response.data);
        return response.data;
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedData = {
        ...appointment,
        klinik: appointment.klinik,
        danismanlar: appointment.danismanlar || [],
        hizmet: appointment.hizmet || null,
        uye: appointment.uye || null,
        durum: appointment.durum,
        tarih: appointment.tarih
      };
      
      if (updatedData.uye === '') {
        updatedData.uye = null;
      }
      
      const response = await updateAppointment(id, updatedData);
      
      if (response && response.data) {
        toast.success('Randevu başarıyla güncellendi');
        navigate('/randevular');
      } else {
        setError('Randevu güncellenirken bir hata oluştu');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Randevu güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/randevular');
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h1 className="mb-4">Randevu Düzenle</h1>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <AppointmentForm
            appointment={appointment}
            clinics={clinics}
            consultants={consultants}
            services={services}
            members={members}
            setAppointment={setAppointment}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            isLoading={loading}
            isEdit={true}
            loadClinicConsultants={loadClinicConsultants}
            loadConsultantServices={loadConsultantServices}
            submitButtonText={loading ? 'Güncelleniyor...' : 'Randevu Güncelle'}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentEdit; 