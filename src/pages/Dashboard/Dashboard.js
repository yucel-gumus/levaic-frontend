import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAppointments } from '../../services/appointmentApi';
import { 
  ClinicIcon, 
  CheckIcon, 
  PlusIcon, 
  TrendUpIcon,
  ArrowRightIcon
} from '../../components/icons';
import './Dashboard.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0
  });

  // Fetch data
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAppointments();
      setAppointments(response.data);
      
      // Calculate statistics
      const total = response.data.length;
      const completed = response.data.filter(app => app.durum === 'Tamamlandı').length;
      const pending = response.data.filter(app => app.durum === 'Beklemede').length;
      
      // Calculate today's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayApps = response.data.filter(app => {
        const appDate = new Date(app.tarih);
        appDate.setHours(0, 0, 0, 0);
        return appDate.getTime() === today.getTime();
      }).length;
      
      setStats({
        totalAppointments: total,
        completedAppointments: completed,
        pendingAppointments: pending,
        todayAppointments: todayApps
      });
      
      setError(null);
    } catch (err) {
      setError('Randevular yüklenirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format appointment date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
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
            <h3>Toplam Randevu</h3>
            <h2>{stats.totalAppointments}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-icon">
            <CheckIcon />
          </div>
          <div className="stat-info">
            <h3>Tamamlanan Randevu</h3>
            <h2>{stats.completedAppointments}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon new-icon">
            <PlusIcon />
          </div>
          <div className="stat-info">
            <h3>Bekleyen Randevu</h3>
            <h2>{stats.pendingAppointments}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon user-icon">
            <TrendUpIcon />
          </div>
          <div className="stat-info">
            <h3>Bugünkü Randevular</h3>
            <h2>{stats.todayAppointments}</h2>
          </div>
        </div>
      </div>
      
      {/* Recent Appointments Section */}
      <div className="recent-list">
        <div className="list-header">
          <h2>Son Eklenen Randevular</h2>
          <Link to="/randevular" className="view-all">
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
        ) : appointments.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Klinik</th>
                  <th>Danışman</th>
                  <th>Üye</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map(appointment => (
                  <tr key={appointment._id}>
                    <td>{appointment.klinik?.ad || 'Belirtilmemiş'}</td>
                    <td>
                      {appointment.danismanlar && appointment.danismanlar.length > 0
                        ? `${appointment.danismanlar[0].ad || ''} ${appointment.danismanlar[0].soyad || ''}`
                        : 'Belirtilmemiş'}
                    </td>
                    <td>
                      {appointment.uye 
                        ? `${appointment.uye.ad || ''} ${appointment.uye.soyad || ''}`
                        : 'Belirtilmemiş'}
                    </td>
                    <td>{formatDate(appointment.tarih)}</td>
                    <td>
                      <span className={`status-badge ${
                        appointment.durum === 'Onaylandı' 
                          ? 'active' 
                          : appointment.durum === 'İptal Edildi' 
                            ? 'inactive' 
                            : appointment.durum === 'Tamamlandı'
                              ? 'completed'
                              : 'pending'
                      }`}>
                        {appointment.durum}
                      </span>
                    </td>
                    <td>
                      <Link 
                        to={`/randevular/edit/${appointment._id}`}
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
            Henüz randevu bulunmamaktadır. Yeni bir randevu eklemek için 
            <Link to="/randevular/create" className="mx-1">buraya tıklayın</Link>.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 