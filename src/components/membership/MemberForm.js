import React from 'react';
import { useNavigate } from 'react-router-dom';
import CardSection from '../common/CardSection';
import FormField from '../common/FormField';
import FormRow from '../common/FormRow';
import { KAN_GRUBU_OPTIONS, CINSIYET_OPTIONS } from '../../constants';

/**
 * Üye bilgileri için ortak form bileşeni
 * @param {Object} props - Bileşen özellikleri
 * @param {Object} props.formData - Form verileri
 * @param {Function} props.setFormData - Form verilerini güncelleyen fonksiyon
 * @param {Function} props.handleSubmit - Form gönderme işlevi
 * @param {Array} props.clinics - Klinikler listesi
 * @param {boolean} props.loading - Yükleniyor mu?
 * @returns {JSX.Element}
 */
const MemberForm = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  clinics = [], 
  loading = false,
  error = null,
  isEditMode = false
}) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger mb-4 white-space-pre-line">{error}</div>
      )}

      <CardSection 
        title="Kişisel Bilgiler" 
        headerClassName="bg-primary" 
        icon="fas fa-user"
      >
        <FormRow>
          <FormField
            label="Ad"
            name="ad"
            value={formData.ad}
            onChange={handleChange}
            required
          />
          <FormField
            label="Soyad"
            name="soyad"
            value={formData.soyad}
            onChange={handleChange}
            required
          />
        </FormRow>

        <FormRow>
          <FormField
            label="E-posta"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormField
            label="İletişim Numarası"
            name="iletisim_numarasi"
            value={formData.iletisim_numarasi}
            onChange={handleChange}
            required
          />
        </FormRow>

        <FormRow>
          <FormField
            label="Doğum Tarihi"
            name="dogum_tarihi"
            value={formData.dogum_tarihi}
            onChange={handleChange}
            placeholder="GG.AA.YYYY"
            required
            colWidth="col-md-4"
          />
          <FormField
            label="Kan Grubu"
            name="kan_grubu"
            type="select"
            value={formData.kan_grubu}
            onChange={handleChange}
            options={KAN_GRUBU_OPTIONS}
            required
            colWidth="col-md-4"
          />
          <FormField
            label="Cinsiyet"
            name="cinsiyet"
            type="select"
            value={formData.cinsiyet}
            onChange={handleChange}
            options={CINSIYET_OPTIONS}
            required
            colWidth="col-md-4"
          />
        </FormRow>
      </CardSection>

      <CardSection 
        title="Klinik ve Adres Bilgileri" 
        headerClassName="bg-info" 
        icon="fas fa-hospital-alt"
      >
        <FormRow>
          <FormField
            label="Klinik"
            name="klinik"
            type="select"
            value={formData.klinik}
            onChange={handleChange}
            required
            options={clinics.map(clinic => ({
              value: clinic._id,
              label: clinic.ad
            }))}
          />
        </FormRow>

        <FormRow>
          <FormField
            label="Adres"
            name="adres"
            type="textarea"
            value={formData.adres}
            onChange={handleChange}
            required
            rows={2}
          />
        </FormRow>

        <FormRow>
          <FormField
            label="Şehir"
            name="sehir"
            value={formData.sehir}
            onChange={handleChange}
            required
            colWidth="col-md-4"
          />
          <FormField
            label="Ülke"
            name="ulke"
            value={formData.ulke}
            onChange={handleChange}
            required
            colWidth="col-md-4"
          />
          <FormField
            label="Posta Kodu"
            name="posta_kodu"
            value={formData.posta_kodu}
            onChange={handleChange}
            required
            colWidth="col-md-4"
          />
        </FormRow>
      </CardSection>

      <CardSection 
        title="Acil Durum İletişim Bilgileri" 
        headerClassName="bg-danger" 
        icon="fas fa-exclamation-triangle"
      >
        <FormRow>
          <FormField
            label="Acil Durumda Ulaşılacak Kişi"
            name="acil_durum_kisi"
            value={formData.acil_durum_kisi}
            onChange={handleChange}
            required
          />
          <FormField
            label="Acil Durumda Ulaşılacak Telefon"
            name="acil_durum_tel"
            value={formData.acil_durum_tel}
            onChange={handleChange}
            required
          />
        </FormRow>
      </CardSection>

      <CardSection 
        title="Üyelik Durumu" 
        headerClassName="bg-success" 
        icon="fas fa-check-circle"
      >
        <FormRow>
          <FormField
            label="Durum"
            name="durum"
            type="select"
            value={formData.durum}
            onChange={handleChange}
            options={[
              { value: 'Aktif', label: 'Aktif' },
              { value: 'Pasif', label: 'Pasif' }
            ]}
          />
        </FormRow>
      </CardSection>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={() => navigate('/uyelik')}
        >
          <i className="fas fa-times me-1"></i> İptal
        </button>
        <button 
          type="submit" 
          className="btn btn-success" 
          disabled={loading}
        >
          <i className="fas fa-save me-1"></i> {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
};

export default MemberForm; 