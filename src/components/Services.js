import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices, deleteService } from '../services/serviceApi';
import './Service.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
      setLoading(false);
    } catch (err) {
      setError('Hizmetler yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
      try {
        await deleteService(id);
        setServices(services.filter(service => service._id !== id));
      } catch (err) {
        setError('Hizmet silinirken bir hata oluştu');
      }
    }
  };

  if (loading) {
    return (
      <div className="service-container">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-container">
      <div className="service-header">
        <h1>Hizmetler</h1>
        <Link to="/hizmet/ekle" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Yeni Hizmet Ekle
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">{error}</div>
      )}

      <div className="service-content">
        <div className="table-responsive">
          <table className="service-table">
            <thead>
              <tr>
                <th>Hizmet Adı</th>
                <th>Kategori</th>
                <th>Ücret</th>
                <th>Süre</th>
                <th>Telemed</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service._id}>
                  <td>{service.hizmet_adi}</td>
                  <td>{service.hizmet_kategorisi}</td>
                  <td>₺{service.ucret}</td>
                  <td>{service.sure.saat}s {service.sure.dakika}d</td>
                  <td>
                    <span className={`service-badge ${service.telemed_hizmeti ? 'service-badge-active' : 'service-badge-passive'}`}>
                      {service.telemed_hizmeti ? 'Evet' : 'Hayır'}
                    </span>
                  </td>
                  <td>
                    <span className={`service-badge ${service.durum === 'Aktif' ? 'service-badge-active' : 'service-badge-passive'}`}>
                      {service.durum}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <Link 
                        to={`/hizmet/duzenle/${service._id}`} 
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Services; 