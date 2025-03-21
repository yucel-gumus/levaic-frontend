import React from 'react';
import { MultiSelect } from './MultiSelect';
import { 
  HIZMET_KATEGORILERI, 
  HIZMET_DURUMLARI, 
  EVET_HAYIR_OPTIONS 
} from '../constants';
import './Service.css';

const ServiceForm = ({ service, onChange, onSubmit, submitButtonText = 'Kaydet', onCancel }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...service,
      [name]: value
    });
  };

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...service,
      sure: {
        ...service.sure,
        [name]: parseInt(value) || 0
      }
    });
  };

  const handleBooleanChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...service,
      [name]: value === 'true'
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="fas fa-concierge-bell me-2"></i>
            Hizmet Bilgileri
          </h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="hizmet_kategorisi" className="form-label">Hizmet Kategorisi</label>
              <select
                className="form-control"
                id="hizmet_kategorisi"
                name="hizmet_kategorisi"
                value={service.hizmet_kategorisi}
                onChange={handleInputChange}
                required
              >
                <option value="">Seçiniz</option>
                {HIZMET_KATEGORILERI.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="hizmet_adi" className="form-label">Hizmet Adı</label>
              <input
                type="text"
                className="form-control"
                id="hizmet_adi"
                name="hizmet_adi"
                value={service.hizmet_adi}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="ucret" className="form-label">Ücret (₺)</label>
              <div className="service-price-input">
                <input
                  type="number"
                  className="form-control"
                  id="ucret"
                  name="ucret"
                  value={service.ucret}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="telemed_hizmeti" className="form-label">Telemed Hizmeti mi?</label>
              <select
                className="form-control"
                id="telemed_hizmeti"
                name="telemed_hizmeti"
                value={service.telemed_hizmeti}
                onChange={handleBooleanChange}
                required
              >
                {EVET_HAYIR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="klinikler" className="form-label">Klinikler</label>
            <MultiSelect
              options={service.klinikOptions || []}
              selectedValues={service.klinikler}
              onChange={(values) => {
                onChange({
                  ...service,
                  klinikler: values
                });
              }}
              placeholder="Klinik seçiniz..."
              noOptionsMessage="Klinik bulunamadı"
              allSelectedMessage="Tüm klinikler seçildi"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="danismanlar" className="form-label">Danışmanlar</label>
            <MultiSelect
              options={service.danismanOptions || []}
              selectedValues={service.danismanlar}
              onChange={(values) => {
                onChange({
                  ...service,
                  danismanlar: values
                });
              }}
              placeholder="Danışman seçiniz..."
              noOptionsMessage="Danışman bulunamadı"
              allSelectedMessage="Tüm danışmanlar seçildi"
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Süre</label>
              <div className="service-duration-inputs">
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control"
                    name="saat"
                    value={service.sure?.saat || 0}
                    onChange={handleDurationChange}
                    min="0"
                    max="24"
                    required
                    placeholder="Saat"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control"
                    name="dakika"
                    value={service.sure?.dakika || 0}
                    onChange={handleDurationChange}
                    min="0"
                    max="59"
                    required
                    placeholder="Dakika"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="durum" className="form-label">Durum</label>
              <select
                className="form-control"
                id="durum"
                name="durum"
                value={service.durum}
                onChange={handleInputChange}
                required
              >
                {HIZMET_DURUMLARI.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="coklu_secim" className="form-label">
              Rezervasyon sırasında çoklu seçime izin verilsin mi?
            </label>
            <select
              className="form-control"
              id="coklu_secim"
              name="coklu_secim"
              value={service.coklu_secim}
              onChange={handleBooleanChange}
              required
            >
              {EVET_HAYIR_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="service-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel}
        >
          İptal
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={submitButtonText.includes('Kaydediliyor')}
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm; 