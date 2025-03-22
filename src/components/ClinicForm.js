import React from 'react';
import { MultiSelect } from './MultiSelect';
import { UZMANLIK_ALANLARI_OPTIONS, KLINIK_DURUMLARI, CINSIYET_OPTIONS } from '../constants';

const ClinicForm = ({ clinic, onChange, onSubmit, submitButtonText = 'Kaydet', onCancel }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...clinic,
      [name]: value
    });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...clinic,
          [fieldName]: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="fas fa-hospital-alt me-2"></i>
            Klinik Bilgileri
          </h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="ad" className="form-label">Klinik Adı</label>
              <input
                type="text"
                className="form-control"
                id="ad"
                name="ad"
                value={clinic.ad}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="e_posta" className="form-label">E-posta</label>
              <input
                type="email"
                className="form-control"
                id="e_posta"
                name="e_posta"
                value={clinic.e_posta}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="iletisim_numarasi" className="form-label">İletişim Numarası</label>
              <input
                type="text"
                className="form-control"
                id="iletisim_numarasi"
                name="iletisim_numarasi"
                value={clinic.iletisim_numarasi}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="durum" className="form-label">Durum</label>
              <select
                className="form-control"
                id="durum"
                name="durum"
                value={clinic.durum}
                onChange={handleInputChange}
                required
              >
                {KLINIK_DURUMLARI.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="uzmanlik_alanlari" className="form-label">Uzmanlık Alanları</label>
            <MultiSelect
              options={UZMANLIK_ALANLARI_OPTIONS}
              selectedValues={clinic.uzmanlik_alanlari}
              onChange={(values) => {
                onChange({
                  ...clinic,
                  uzmanlik_alanlari: values
                });
              }}
              placeholder="Uzmanlık alanları seçiniz..."
              noOptionsMessage="Uzmanlık alanı bulunamadı"
              allSelectedMessage="Tüm uzmanlık alanları seçildi"
            />
            <small className="form-text text-muted">Birden fazla seçenek ekleyebilirsiniz.</small>
          </div>
          <div className="mb-3">
            <label htmlFor="adres" className="form-label">Adres</label>
            <textarea
              className="form-control"
              id="adres"
              name="adres"
              value={clinic.adres}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="sehir" className="form-label">Şehir</label>
              <input
                type="text"
                className="form-control"
                id="sehir"
                name="sehir"
                value={clinic.sehir}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="ulke" className="form-label">Ülke</label>
              <input
                type="text"
                className="form-control"
                id="ulke"
                name="ulke"
                value={clinic.ulke}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="posta_kodu" className="form-label">Posta Kodu</label>
              <input
                type="text"
                className="form-control"
                id="posta_kodu"
                name="posta_kodu"
                value={clinic.posta_kodu}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="profil_resmi" className="form-label">Klinik Profil Resmi</label>
            <input
              type="file"
              className="form-control"
              id="profil_resmi"
              name="profil_resmi"
              onChange={(e) => handleFileChange(e, 'profil_resmi')}
            />
            {clinic.profil_resmi && clinic.profil_resmi.includes('base64') && (
              <div className="mt-2">
                <img 
                  src={clinic.profil_resmi} 
                  alt="Klinik Profil Resmi" 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                />
              </div>
            )}
            {clinic.profil_resmi_url && (
              <div className="mt-2">
                <img 
                  src={clinic.profil_resmi_url} 
                  alt="Klinik Profil Resmi" 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h3 className="mb-0">
            <i className="fas fa-user-tie me-2"></i>
            Klinik Yöneticisi Bilgileri
          </h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="yonetici_ad" className="form-label">Yönetici Adı</label>
              <input
                type="text"
                className="form-control"
                id="yonetici_ad"
                name="yonetici_ad"
                value={clinic.yonetici_ad}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="yonetici_soyad" className="form-label">Yönetici Soyadı</label>
              <input
                type="text"
                className="form-control"
                id="yonetici_soyad"
                name="yonetici_soyad"
                value={clinic.yonetici_soyad}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="yonetici_e_posta" className="form-label">Yönetici E-posta</label>
              <input
                type="email"
                className="form-control"
                id="yonetici_e_posta"
                name="yonetici_e_posta"
                value={clinic.yonetici_e_posta}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="yonetici_iletisim_numarasi" className="form-label">Yönetici İletişim Numarası</label>
              <input
                type="text"
                className="form-control"
                id="yonetici_iletisim_numarasi"
                name="yonetici_iletisim_numarasi"
                value={clinic.yonetici_iletisim_numarasi}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="yonetici_dogum_tarihi" className="form-label">Yönetici Doğum Tarihi (gg.aa.yyyy)</label>
              <input
                type="text"
                className="form-control"
                id="yonetici_dogum_tarihi"
                name="yonetici_dogum_tarihi"
                value={clinic.yonetici_dogum_tarihi}
                onChange={handleInputChange}
                placeholder="01.01.1980"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="yonetici_cinsiyet" className="form-label">Yönetici Cinsiyet</label>
              <select
                className="form-control"
                id="yonetici_cinsiyet"
                name="yonetici_cinsiyet"
                value={clinic.yonetici_cinsiyet}
                onChange={handleInputChange}
                required
              >
                {CINSIYET_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="yonetici_profil_resmi" className="form-label">Yönetici Profil Resmi</label>
            <input
              type="file"
              className="form-control"
              id="yonetici_profil_resmi"
              name="yonetici_profil_resmi"
              onChange={(e) => handleFileChange(e, 'yonetici_profil_resmi')}
            />
            {clinic.yonetici_profil_resmi && clinic.yonetici_profil_resmi.includes('base64') && (
              <div className="mt-2">
                <img 
                  src={clinic.yonetici_profil_resmi} 
                  alt="Yönetici Profil Resmi" 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} 
                />
              </div>
            )}
            {clinic.yonetici_profil_resmi_url && (
              <div className="mt-2">
                <img 
                  src={clinic.yonetici_profil_resmi_url} 
                  alt="Yönetici Profil Resmi" 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 d-flex justify-content-end">
        {onCancel && (
          <button 
            type="button" 
            className="btn btn-secondary me-2"
            onClick={onCancel}
          >
            <i className="fas fa-times me-1"></i> İptal
          </button>
        )}
        <button type="submit" className="btn btn-success">
          <i className="fas fa-save me-1"></i> {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default ClinicForm; 