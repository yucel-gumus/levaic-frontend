import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AppointmentForm from '../../components/AppointmentForm';
import { createAppointment } from '../../services/appointmentApi';
import { getConsultants } from '../../services/consultantApi';
import { getClinics } from '../../services/clinicApi';

const AppointmentCreate = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Boş randevu şablonu
  const [appointment, setAppointment] = useState({
    klinik: '',
    danismanlar: [],
    hizmet: '',
    tarih: new Date().toISOString(),
    durum: 'Beklemede',
    uye: '',
  });

  useEffect(() => {
    loadClinics();
    loadConsultants();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Form alanlarının dolu olup olmadığını kontrol et
      if (!appointment.klinik || 
          !appointment.danismanlar.length || 
          !appointment.hizmet || 
          !appointment.uye || 
          !appointment.tarih) {
        setError('Lütfen tüm zorunlu alanları doldurun.');
        setLoading(false);
        return;
      }

      // Randevu verilerini hazırla
      const appointmentData = {
        ...appointment,
        danismanlar: appointment.danismanlar.length > 0 ? appointment.danismanlar : [appointment.danismanlar[0]],
      };

      const response = await createAppointment(appointmentData);
      
      if (response && response.data) {
        toast.success('Randevu başarıyla oluşturuldu!');
        navigate('/randevular');
      } else {
        setError('Randevu oluşturulurken bir hata meydana geldi.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Randevu oluşturulurken bir hata oluştu.');
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
          <h1 className="mb-4">Yeni Randevu Oluştur</h1>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <AppointmentForm
            appointment={appointment}
            clinics={clinics}
            consultants={consultants}
            setAppointment={setAppointment}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            isLoading={loading}
            submitButtonText={loading ? 'Kaydediliyor...' : 'Randevu Oluştur'}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentCreate; 