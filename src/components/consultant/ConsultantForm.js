import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CINSIYET_OPTIONS, UZMANLIK_ALANLARI_OPTIONS } from '../../constants';
import { MultiSelect } from '../MultiSelect';
import FormField from '../common/FormField';
import FormRow from '../common/FormRow';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

/**
 * Danışman formu bileşeni
 * @param {Object} props
 * @param {Object} props.formData Form verileri
 * @param {Function} props.handleChange Form değişiklik işleyicisi
 * @param {Function} props.handleSubmit Form gönderme işleyicisi
 * @param {Array} props.clinics Klinikler listesi
 * @param {Boolean} props.loading Yükleniyor durumu
 * @param {String} props.error Hata mesajı
 * @returns {JSX.Element}
 */
const ConsultantForm = ({ formData, handleChange, handleSubmit, clinics, loading, error }) => {
  // MultiSelect için seçilmiş klinik ID'sini dizi formatında tutar
  const [selectedClinicId, setSelectedClinicId] = useState(
    formData.klinik ? [formData.klinik] : []
  );

  // MultiSelect için seçilmiş uzmanlık alanını dizi formatında tutar
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    formData.uzmanlik ? [formData.uzmanlik] : []
  );

  // Durum seçenekleri
  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Pasif', label: 'Pasif' }
  ];

  // Klinik seçimi değiştiğinde
  const handleClinicChange = (selectedIds) => {
    // MultiSelect çoklu seçim destekliyor, ama biz sadece ilk değeri alıyoruz
    const selectedId = selectedIds.length > 0 ? selectedIds[0] : '';
    
    // Form verisini güncelle
    handleChange({ 
      target: { 
        name: 'klinik', 
        value: selectedId 
      } 
    });
    
    // Seçili ID'yi dizi olarak tut (MultiSelect için)
    setSelectedClinicId(selectedIds.length > 0 ? [selectedId] : []);
  };

  // Uzmanlık alanı seçimi değiştiğinde
  const handleSpecialtyChange = (selectedValues) => {
    // MultiSelect çoklu seçim destekliyor, ama biz sadece ilk değeri alıyoruz
    const selectedValue = selectedValues.length > 0 ? selectedValues[0] : '';
    
    // Form verisini güncelle
    handleChange({ 
      target: { 
        name: 'uzmanlik', 
        value: selectedValue 
      } 
    });
    
    // Seçili değeri dizi olarak tut (MultiSelect için)
    setSelectedSpecialty(selectedValues.length > 0 ? [selectedValue] : []);
  };

  // Klinikleri MultiSelect için format
  const clinicOptions = clinics && clinics.length > 0 
    ? clinics.map(clinic => ({
        value: clinic._id,
        label: clinic.ad
      }))
    : [];

  return (
    <form onSubmit={handleSubmit} className="consultant-form">
      {error && <ErrorAlert message={error} />}
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Temel Bilgiler</h5>
        </div>
        <div className="card-body">
          <FormRow>
            <FormField
              id="ad"
              label="Ad *"
              type="text"
              name="ad"
              value={formData.ad}
              onChange={handleChange}
              required
              placeholder="Danışmanın adı"
              size="6"
            />
            
            <FormField
              id="soyad"
              label="Soyad *"
              type="text"
              name="soyad"
              value={formData.soyad}
              onChange={handleChange}
              required
              placeholder="Danışmanın soyadı"
              size="6"
            />
          </FormRow>
          
          <FormRow>
            <div className="col-md-6">
              <label htmlFor="klinik" className="form-label">Klinik *</label>
              <MultiSelect
                options={clinicOptions}
                selectedValues={selectedClinicId}
                onChange={handleClinicChange}
                placeholder="Klinik seçiniz..."
              />
              {!clinicOptions.length && (
                <small className="text-danger">Klinik bulunmamaktadır. Önce klinik ekleyin.</small>
              )}
            </div>
            
            <FormField
              id="email"
              label="E-posta *"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ornek@mail.com"
              size="6"
            />
          </FormRow>
          
          <FormRow>
            <FormField
              id="iletisim_numarasi"
              label="İletişim Numarası *"
              type="text"
              name="iletisim_numarasi"
              value={formData.iletisim_numarasi}
              onChange={handleChange}
              required
              placeholder="0555 555 5555"
              size="6"
            />
            
            <FormField
              id="dogum_tarihi"
              label="Doğum Tarihi *"
              type="text"
              name="dogum_tarihi"
              value={formData.dogum_tarihi}
              onChange={handleChange}
              required
              placeholder="GG.AA.YYYY"
              size="6"
            />
          </FormRow>
          
          <FormRow>
            <div className="col-md-6">
              <label htmlFor="uzmanlik" className="form-label">Uzmanlık *</label>
              <MultiSelect
                options={UZMANLIK_ALANLARI_OPTIONS}
                selectedValues={selectedSpecialty}
                onChange={handleSpecialtyChange}
                placeholder="Uzmanlık alanı seçiniz..."
              />
              {!UZMANLIK_ALANLARI_OPTIONS.length && (
                <small className="text-danger">Uzmanlık alanı bulunamadı.</small>
              )}
            </div>
            
            <FormField
              id="tecrube_yili"
              label="Tecrübe Yılı *"
              type="number"
              name="tecrube_yili"
              value={formData.tecrube_yili}
              onChange={handleChange}
              required
              min="0"
              size="6"
            />
          </FormRow>
          
          <FormRow>
            <div className="col-md-6">
              <label htmlFor="cinsiyet" className="form-label">Cinsiyet *</label>
              <select
                id="cinsiyet"
                name="cinsiyet"
                className="form-select"
                value={formData.cinsiyet || ''}
                onChange={handleChange}
                required
              >
                <option value="">Cinsiyet seçiniz...</option>
                {CINSIYET_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-6">
              <label htmlFor="durum" className="form-label">Durum</label>
              <select
                id="durum"
                name="durum"
                className="form-select"
                value={formData.durum || 'Aktif'}
                onChange={handleChange}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </FormRow>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Adres Bilgileri</h5>
        </div>
        <div className="card-body">
          <FormRow>
            <FormField
              id="adres"
              label="Adres *"
              type="textarea"
              name="adres"
              value={formData.adres}
              onChange={handleChange}
              required
              placeholder="Açık adres"
              size="12"
              rows="3"
            />
          </FormRow>
          
          <FormRow>
            <FormField
              id="sehir"
              label="Şehir *"
              type="text"
              name="sehir"
              value={formData.sehir}
              onChange={handleChange}
              required
              placeholder="Şehir"
              size="4"
            />
            
            <FormField
              id="posta_kodu"
              label="Posta Kodu *"
              type="text"
              name="posta_kodu"
              value={formData.posta_kodu || ''}
              onChange={handleChange}
              required
              placeholder="34000"
              size="4"
            />
            
            <FormField
              id="ulke"
              label="Ülke *"
              type="text"
              name="ulke"
              value={formData.ulke}
              onChange={handleChange}
              required
              placeholder="Ülke"
              size="4"
            />
          </FormRow>
        </div>
      </div>
      
      <div className="d-flex justify-content-between">
        <Link to="/danisman" className="btn btn-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Vazgeç
        </Link>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner small /> Kaydediliyor...
            </>
          ) : (
            <>
              <i className="fas fa-save me-2"></i>
              Kaydet
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ConsultantForm; 