import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ClinicIcon, 
  ChartIcon, 
  UserIcon, 
  MenuIcon, 
  BellIcon, 
  SearchIcon,
  LogoutIcon,
  SettingsIcon
} from '../components/icons';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  
  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Kullanıcı çıkışını authService ile yap
    authService.logout();
    
    // Kullanıcıya bildirim göster
    toast.success('Başarıyla çıkış yapıldı.');
    
    // Giriş sayfasına yönlendir
    navigate('/login');
  };

  // Determine the active tab based on current URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/klinik')) return 'clinics';
    if (path.includes('/uyelik')) return 'membership';
    if (path.includes('/danisman')) return 'consultant';
    if (path.includes('/hizmet')) return 'services';
    return '';
  };

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={`layout-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            {sidebarCollapsed ? (
              <div className="logo-mini">L</div>
            ) : (
              <h2 className="logo">Levaic</h2>
            )}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <MenuIcon />
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul className="nav-list">
              <li className={`nav-item ${getActiveTab() === 'dashboard' ? 'active' : ''}`}>
                <button onClick={() => navigate('/dashboard')} className="nav-link">
                  <span className="nav-icon"><ChartIcon /></span>
                  {!sidebarCollapsed && <span className="nav-text">Dashboard</span>}
                </button>
              </li>
              <li className={`nav-item ${getActiveTab() === 'clinics' ? 'active' : ''}`}>
                <button onClick={() => navigate('/klinik')} className="nav-link">
                  <span className="nav-icon"><ClinicIcon /></span>
                  {!sidebarCollapsed && <span className="nav-text">Klinikler</span>}
                </button>
              </li>
              <li className={`nav-item ${getActiveTab() === 'membership' ? 'active' : ''}`}>
                <button onClick={() => navigate('/uyelik')} className="nav-link">
                  <span className="nav-icon"><UserIcon /></span>
                  {!sidebarCollapsed && <span className="nav-text">Üyelik</span>}
                </button>
              </li>
              <li className={`nav-item ${getActiveTab() === 'consultant' ? 'active' : ''}`}>
                <button onClick={() => navigate('/danisman')} className="nav-link">
                  <span className="nav-icon"><UserIcon /></span>
                  {!sidebarCollapsed && <span className="nav-text">Danışmanlar</span>}
                </button>
              </li>
              <li className={`nav-item ${getActiveTab() === 'services' ? 'active' : ''}`}>
                <button onClick={() => navigate('/hizmet')} className="nav-link">
                  <span className="nav-icon"><ChartIcon /></span>
                  {!sidebarCollapsed && <span className="nav-text">Hizmetler</span>}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          {!sidebarCollapsed && (
            <div className="sidebar-footer-content">
              <p className="version">v1.0.0</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="page-title">
                {getActiveTab() === 'dashboard' && 'Dashboard'}
                {getActiveTab() === 'clinics' && 'Klinikler'}
                {getActiveTab() === 'membership' && 'Üyelik'}
                {getActiveTab() === 'consultant' && 'Danışmanlar'}
                {getActiveTab() === 'services' && 'Hizmetler'}
              </h1>
            </div>
            
            <div className="header-right">
              {/* User Profile */}
              <div className="profile-container">
                <button className="profile-button" onClick={toggleDropdown} aria-label="User menu">
                  <div className="avatar">
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" alt={user?.name || 'User'} />
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <span className="user-name">{user?.name || 'User'}</span>
                      <svg className={`dropdown-arrow ${showDropdown ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </>
                  )}
                </button>
                
                {showDropdown && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <span className="dropdown-username">{user?.name || 'User'}</span>
                      <button className="dropdown-link text-danger" onClick={handleLogout}>
                        <span className="dropdown-icon"><LogoutIcon /></span>
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                    <ul className="dropdown-menu">
                      <li className="dropdown-item">
                        <button className="dropdown-link" onClick={() => navigate('/profile')}>
                          <span className="dropdown-icon"><UserIcon /></span>
                          <span>Profilim</span>
                        </button>
                      </li>
                      <li className="dropdown-item">
                        <button className="dropdown-link">
                          <span className="dropdown-icon"><SettingsIcon /></span>
                          <span>Ayarlar</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 