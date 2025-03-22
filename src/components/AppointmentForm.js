import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { RANDEVU_DURUMLARI } from '../constants';
import { getServicesByConsultant } from '../services/serviceApi';
import { getMembers } from '../services/memberApi';

const AppointmentForm = ({
  appointment,
  clinics = [],
  consultants = [],
  setAppointment,
  handleSubmit,
  handleCancel,
  isLoading,
  submitButtonText,
  initialServices = [],
  loadClinicConsultants,
  loadConsultantServices: parentLoadConsultantServices,
  isEdit = false,
  services: parentServices = []
}) => {
  const [services, setServices] = useState(isEdit ? parentServices : initialServices);
  const [selectedService, setSelectedService] = useState(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberError, setMemberError] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    if (appointment.hizmet && appointment.danismanlar && appointment.danismanlar.length > 0 && services.length === 0) {
      loadConsultantServices(appointment.danismanlar[0]);
    }
  }, [appointment.hizmet, appointment.danismanlar, services.length]);

  useEffect(() => {
    if (appointment.hizmet && services.length > 0) {
      const service = services.find(s => s._id === appointment.hizmet);
      setSelectedService(service || null);
    }
  }, [appointment.hizmet, services]);

  useEffect(() => {
    if (isEdit && parentServices.length > 0) {
      setServices(parentServices);
    }
  }, [isEdit, parentServices]);

  const loadMembers = async () => {
    setLoadingMembers(true);
    setMemberError(null);
    try {
      const response = await getMembers();
      if (response && response.data) {
        setMembers(response.data);
      } else {
        setMembers([]);
      }
    } catch (err) {
      setMemberError('Üyeler yüklenirken bir hata oluştu.');
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'klinik') {
      setAppointment({ 
        ...appointment, 
        [name]: value,
        danismanlar: [],
        hizmet: '' 
      });
      
      setServices([]);
      setSelectedService(null);
      
      if (isEdit && loadClinicConsultants) {
        loadClinicConsultants(value);
      }
    } 
    else if (name === 'uye') {
      setAppointment({ ...appointment, uye: value });
    }
    else {
      setAppointment({ ...appointment, [name]: value });
    }
  };

  const handleDanismanlarChange = async (selectedValues) => {
    
    setAppointment({ 
      ...appointment, 
      danismanlar: selectedValues,
      hizmet: '' 
    });
    
    if (selectedValues.length === 1) {
      const consultantId = selectedValues[0];
      
      if (isEdit && parentLoadConsultantServices) {
        await parentLoadConsultantServices(consultantId);
      } else {
        await loadConsultantServices(consultantId);
      }
    } else {
      setServices([]);
      setSelectedService(null);
    }
  };

  const loadConsultantServices = async (consultantId) => {
    if (!consultantId) {
      return;
    }
    
    setLoadingServices(true);
    setServiceError(null);
    
    try {
      const response = await getServicesByConsultant(consultantId);
     
      
      if (response && response.data) {
      
        setServices(response.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Hizmet yükleme hatası:", err);
      setServiceError('Danışmana ait hizmetler yüklenirken bir hata oluştu.');
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleServiceChange = (e) => {
    const { value } = e.target;
    setAppointment({ ...appointment, hizmet: value });
    
    // Seçilen hizmeti bul
    if (value) {
      const service = services.find(s => s._id === value);
      setSelectedService(service);
    } else {
      setSelectedService(null);
    }
  };

  const formatDateForInput = () => {
    if (!appointment.tarih) return '';
    
    try {
      const date = new Date(appointment.tarih);
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return localDate.toISOString().substring(0, 16);
    } catch (error) {
      return '';
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        {/* Klinik Seçimi */}
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Klinik</Form.Label>
            <Form.Control
              as="select"
              name="klinik"
              value={appointment.klinik || ''}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            >
              <option value="">Klinik Seçiniz</option>
              {clinics.map(clinic => (
                <option key={clinic._id} value={clinic._id}>
                  {clinic.ad}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        
        {/* Danışman Seçimi - Tek veya çoklu seçim */}
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Danışman(lar)</Form.Label>
            <Form.Control
              as="select"
              name="danismanlar"
              value={appointment.danismanlar?.[0] || ''}
              onChange={(e) => handleDanismanlarChange([e.target.value])}
              disabled={isLoading || !appointment.klinik}
              required
            >
              <option value="">Danışman Seçiniz</option>
              {consultants
                .filter(consultant => {
                  if (!appointment.klinik) return true;
                  
                  // Danışman klinik bilgisi obje veya string olabilir
                  const consultantClinicId = typeof consultant.klinik === 'object' 
                    ? consultant.klinik._id 
                    : consultant.klinik;
                  
                  return consultantClinicId === appointment.klinik;
                })
                .map(consultant => (
                  <option key={consultant._id} value={consultant._id}>
                    {consultant.ad} {consultant.soyad}
                  </option>
                ))
              }
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        {/* Hizmet Seçimi */}
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Hizmet</Form.Label>
            {loadingServices ? (
              <p>Hizmetler yükleniyor...</p>
            ) : (
              <Form.Control
                as="select"
                name="hizmet"
                value={appointment.hizmet || ''}
                onChange={handleServiceChange}
                disabled={isLoading || !appointment.danismanlar?.length}
                required
              >
                <option value="">Hizmet Seçiniz</option>
                {services.map(service => (
                  <option key={service._id} value={service._id}>
                    {service.hizmet_adi || service.ad}
                  </option>
                ))}
              </Form.Control>
            )}
            {serviceError && <Alert variant="danger">{serviceError}</Alert>}
            
            {/* Seçilen hizmetin detayları */}
            {selectedService && (
              <div className="mt-2">
                <small className="text-muted d-block">
                  Süre: {selectedService.sure && typeof selectedService.sure === 'object' 
                    ? `${selectedService.sure.saat || 0}s ${selectedService.sure.dakika || 0}d` 
                    : selectedService.sure} 
                </small>
                <small className="text-muted d-block">
                  Kategori: {selectedService.hizmet_kategorisi || selectedService.kategori}
                </small>
                <small className="text-muted d-block">
                  Fiyat: {selectedService.ucret || selectedService.fiyat} TL
                </small>
              </div>
            )}
          </Form.Group>
        </Col>
        
        {/* Üye seçimi (ID veya Ad Soyad) */}
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Üye</Form.Label>
            {loadingMembers ? (
              <p>Üyeler yükleniyor...</p>
            ) : (
              <Form.Control
                as="select"
                name="uye"
                value={appointment.uye || ''}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              >
                <option value="">Üye Seçiniz</option>
                {members.map(member => (
                  <option key={member._id} value={member._id}>
                    {member.ad} {member.soyad}
                  </option>
                ))}
              </Form.Control>
            )}
            {memberError && <Alert variant="danger">{memberError}</Alert>}
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        {/* Randevu Tarihi */}
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tarih ve Saat</Form.Label>
            <Form.Control
              type="datetime-local"
              name="tarih"
              value={formatDateForInput()}
              onChange={(e) => setAppointment({
                ...appointment,
                tarih: e.target.value ? new Date(e.target.value).toISOString() : ''
              })}
              disabled={isLoading}
              required
            />
          </Form.Group>
        </Col>
        
        {/* Durum */}
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Durum</Form.Label>
            <Form.Control
              as="select"
              name="durum"
              value={appointment.durum || 'Beklemede'}
              onChange={handleInputChange}
              disabled={isLoading}
            >
              {RANDEVU_DURUMLARI.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      
      {/* Form Düğmeleri */}
      <div className="d-flex justify-content-end gap-2 mt-3 mb-3">
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={isLoading}
        >
          İptal
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          {submitButtonText || 'Kaydet'}
        </Button>
      </div>
    </Form>
  );
};

export default AppointmentForm; 