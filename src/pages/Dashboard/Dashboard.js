import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clinicService } from '../../services/api';
import { 
  ClinicIcon, 
  CheckIcon, 
  PlusIcon, 
  TrendUpIcon,
  ArrowRightIcon
} from '../../components/icons';
import './Dashboard.css';

const Dashboard = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClinics: 0,
    activeClinics: 0,
    newClinicsToday: 0,
    totalRevenue: 0
  });

  // Fetch data
  useEffect(() => {
    fetchClinics();
    fetchStats();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const response = await clinicService.getClinics();
      setClinics(response.data);
      setError(null);
    } catch (err) {
      setError('Klinikler yüklenirken bir hata oluştu: ' + err.message);
      console.error('Klinikler yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await clinicService.getTodayStats();
      setStats(response.data);
    } catch (err) {
      console.error('İstatistikler yüklenemedi:', err);
    }
  };

  return (
    <div className="dashboard-content">
      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon user-icon">
            <ClinicIcon />
          </div>
          <div className="stat-info">
            <h3>Toplam Klinik</h3>
            <h2>{stats.totalClinics}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-icon">
            <CheckIcon />
          </div>
          <div className="stat-info">
            <h3>Aktif Klinik</h3>
            <h2>{stats.activeClinics}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon new-icon">
            <PlusIcon />
          </div>
          <div className="stat-info">
            <h3>Yeni Klinik (Bugün)</h3>
            <h2>{stats.newClinicsToday}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon user-icon">
            <TrendUpIcon />
          </div>
          <div className="stat-info">
            <h3>Toplam Gelir</h3>
            <h2>{stats.totalRevenue ? `${stats.totalRevenue.toLocaleString()} ₺` : '0 ₺'}</h2>
          </div>
        </div>
      </div>
      
      {/* Recent Clinics Section */}
      <div className="recent-list">
        <div className="list-header">
          <h2>Son Eklenen Klinikler</h2>
          <Link to="/klinik" className="view-all">
            Tümünü Görüntüle
            <ArrowRightIcon />
          </Link>
        </div>
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        {loading ? (
          <div className="d-flex justify-content-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        ) : clinics.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Klinik Adı</th>
                  <th>Yönetici</th>
                  <th>Şehir</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {clinics.slice(0, 5).map(clinic => (
                  <tr key={clinic._id}>
                    <td>{clinic.ad}</td>
                    <td>{clinic.yonetici_ad} {clinic.yonetici_soyad}</td>
                    <td>{clinic.sehir}</td>
                    <td>
                      <span className={`status-badge ${clinic.durum === 'Aktif' ? 'active' : clinic.durum === 'Pasif' ? 'inactive' : 'pending'}`}>
                        {clinic.durum}
                      </span>
                    </td>
                    <td>
                      <Link 
                        to={`/klinik/edit/${clinic._id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info">
            Henüz klinik bulunmamaktadır. Yeni bir klinik eklemek için 
            <Link to="/klinik/create" className="mx-1">buraya tıklayın</Link>.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 