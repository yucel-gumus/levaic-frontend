import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import { clinicService } from '../../services/api';
import { clinicService as clinicApiService, deleteClinic } from '../../services/clinicApi';
import { formatApiError } from '../../services/utils';
import { 
  ClinicIcon, 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  EditIcon,
  TrashIcon
} from '../../components/icons';

// Styled component tanımlamaları
const StyledCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const StyledCardHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
`;

const StyledCardBody = styled.div`
  padding: 20px;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => 
    props.status === 'Aktif' ? '#e6f7ee' :
    props.status === 'Pasif' ? '#fee8e7' : '#fff4de'};
  color: ${props => 
    props.status === 'Aktif' ? '#0d6832' :
    props.status === 'Pasif' ? '#d63031' : '#e2a03f'};
`;

// Yeni Filtreleme Paneli Bileşenleri
const FilterPanel = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaedf2;
  position: relative;
  overflow: hidden;
  margin-top: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(to bottom, #2563eb, #1e40af);
  }
`;

const FilterTitle = styled.h6`
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 20px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
    background-color: rgba(37, 99, 235, 0.1);
    padding: 8px;
    border-radius: 8px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

const FilterColumn = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.9rem;
  display: block;
`;

const FilterInput = styled.input`
  width: 100%;
  border-radius: 8px;
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  background-color: #f8f9fa;
  padding-left: ${props => props.hasIcon ? '40px' : '15px'};

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    background-color: #fff;
    outline: none;
  }

  &::placeholder {
    color: #a0aec0;
    font-style: italic;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  border-radius: 8px;
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  background-color: #f8f9fa;
  appearance: auto;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    background-color: #fff;
    outline: none;
  }
`;

const SearchIconWrapper = styled.div`
  position: relative;
  width: 100%;
  
  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    z-index: 1;
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  border-radius: 8px;
  padding: 0 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &.search {
    background-color: #2563eb;
    color: white;
    border: none;
    
    &:hover {
      background-color: #1e40af;
    }
    
    svg {
      margin-right: 8px;
    }
  }
  
  &.clear {
    background-color: #f8f9fa;
    color: #4a5568;
    border: 1px solid #cbd5e0;
    
    &:hover {
      background-color: #edf2f7;
    }
    
    svg {
      margin-right: 8px;
    }
  }
`;

const FilterTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
`;

const FilterTag = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: #edf2f7;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 0.8rem;
  color: #4a5568;
  font-weight: 500;
  
  svg {
    cursor: pointer;
    margin-left: 8px;
    opacity: 0.7;
    transition: all 0.2s ease;
    
    &:hover {
      opacity: 1;
      color: #2563eb;
    }
  }
`;

const ClearAllButton = styled.button`
  background-color: transparent;
  border: none;
  color: #2563eb;
  font-size: 0.85rem;
  padding: 0;
  cursor: pointer;
  font-weight: 500;
  margin-left: 15px;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Ana bileşen
const ClinicList = () => {
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  
  // Filtre durumları
  const [filters, setFilters] = useState({
    city: '',
    status: '',
    manager: ''
  });

  // Klinikleri yükle
  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const response = await clinicService.getAll();
      setClinics(response.data || []);
      setFilteredClinics(response.data || []);
    } catch (err) {
      setError('Klinikler yüklenirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // loadClinics fonksiyonunu fetchClinics olarak yeniden adlandırıyorum
  const loadClinics = fetchClinics;

  const handleDelete = async (id) => {
    if (window.confirm('Bu kliniği silmek istediğinize emin misiniz?')) {
      try {
        setDeleting(true);
        await deleteClinic(id);
        loadClinics();
      } catch (err) {
        setError('Klinik silinirken bir hata oluştu: ' + err.message);
      } finally {
        setDeleting(false);
      }
    }
  };

  // Filtre değişikliği
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      city: '',
      status: '',
      manager: ''
    });
    setResetPaginationToggle(!resetPaginationToggle);
  };

  // Filtreleri uygula
  const applyFilters = () => {
    // Tüm filtreleri uygulama işlemi için gerekirse ek kod buraya eklenebilir
    // Şu anda useMemo ile filteredData zaten otomatik olarak hesaplanıyor
  };

  // Yardımcı fonksiyonlar
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '') || searchTerm !== '';
  };

  const translateFilterKey = (key) => {
    const translations = {
      city: 'Şehir',
      status: 'Durum',
      manager: 'Yönetici'
    };
    return translations[key] || key;
  };

  // Şehir seçenekleri - benzersiz şehirleri al
  const cities = useMemo(() => {
    if (!clinics.length) return [];
    return [...new Set(clinics.map(clinic => clinic.sehir).filter(Boolean))].sort();
  }, [clinics]);

  // Yönetici seçenekleri - benzersiz yöneticileri al
  const managers = useMemo(() => {
    if (!clinics.length) return [];
    const managerList = [...new Set(clinics.map(clinic => 
      clinic.yonetici_ad && clinic.yonetici_soyad ? 
      `${clinic.yonetici_ad} ${clinic.yonetici_soyad}` : null
    ).filter(Boolean))];
    return managerList.sort();
  }, [clinics]);

  // DataTable sütun tanımları
  const columns = [
    {
      name: 'Klinik Adı',
      selector: row => row.ad,
      sortable: true,
      cell: row => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '10px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9ff', borderRadius: '50%', color: '#2563eb' }}>
            <ClinicIcon />
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{row.ad}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{row.adres?.substring(0, 30)}...</div>
          </div>
        </div>
      )
    },
    {
      name: 'Yönetici',
      selector: row => `${row.yonetici_ad} ${row.yonetici_soyad}`,
      sortable: true
    },
    {
      name: 'İletişim',
      selector: row => row.iletisim_numarasi,
      sortable: true
    },
    {
      name: 'Şehir',
      selector: row => row.sehir,
      sortable: true
    },
    {
      name: 'Durum',
      selector: row => row.durum,
      sortable: true,
      cell: row => (
        <StatusBadge status={row.durum}>
          {row.durum}
        </StatusBadge>
      )
    },
    {
      name: 'İşlemler',
      sortable: false,
      cell: row => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link 
            to={`/klinik/edit/${row._id}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: '#2563eb', color: 'white', borderRadius: '6px' }}
            title="Düzenle"
          >
            <EditIcon />
          </Link>
          <button 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: '#ef4444', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            onClick={() => handleDelete(row._id)}
            title="Sil"
          >
            <TrashIcon />
          </button>
        </div>
      )
    }
  ];

  // Filtrelenmiş veriler
  const filteredData = useMemo(() => {
    let filtered = [...clinics];
    
    // Arama terimine göre filtreleme
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(clinic => 
        clinic.ad?.toLowerCase().includes(searchLower) ||
        clinic.adres?.toLowerCase().includes(searchLower) ||
        clinic.iletisim_numarasi?.includes(searchTerm) ||
        clinic.sehir?.toLowerCase().includes(searchLower) ||
        (clinic.yonetici_ad + ' ' + clinic.yonetici_soyad)?.toLowerCase().includes(searchLower)
      );
    }
    
    // Şehir filtrelemesi
    if (filters.city) {
      filtered = filtered.filter(clinic => clinic.sehir === filters.city);
    }
    
    // Durum filtrelemesi
    if (filters.status) {
      filtered = filtered.filter(clinic => clinic.durum === filters.status);
    }
    
    // Yönetici filtrelemesi
    if (filters.manager) {
      filtered = filtered.filter(clinic => 
        `${clinic.yonetici_ad} ${clinic.yonetici_soyad}` === filters.manager
      );
    }
    
    return filtered;
  }, [clinics, searchTerm, filters]);

  // Filtreleme paneli
  const renderFilterPanel = () => {
    return (
      <FilterPanel>
        <FilterTitle>
          <FilterIcon />
          Klinik Filtrele
        </FilterTitle>
        
        <FilterRow>
          <FilterColumn>
            <FilterLabel htmlFor="nameSearch">Klinik Ara</FilterLabel>
            <SearchIconWrapper>
              <SearchIcon />
              <FilterInput
                id="nameSearch"
                type="text"
                placeholder="Klinik adı, telefon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                hasIcon={true}
              />
            </SearchIconWrapper>
          </FilterColumn>
          
          <FilterColumn>
            <FilterLabel htmlFor="cityFilter">Şehir</FilterLabel>
            <FilterSelect
              id="cityFilter"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            >
              <option value="">Tümü</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </FilterSelect>
          </FilterColumn>
          
          <FilterColumn>
            <FilterLabel htmlFor="statusFilter">Durum</FilterLabel>
            <FilterSelect
              id="statusFilter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Tümü</option>
              <option value="Aktif">Aktif</option>
              <option value="Pasif">Pasif</option>
              <option value="Beklemede">Beklemede</option>
            </FilterSelect>
          </FilterColumn>
          
          <FilterColumn>
            <FilterLabel htmlFor="managerFilter">Yönetici</FilterLabel>
            <FilterSelect
              id="managerFilter"
              value={filters.manager}
              onChange={(e) => handleFilterChange('manager', e.target.value)}
            >
              <option value="">Tümü</option>
              {managers.map((manager, index) => (
                <option key={index} value={manager}>{manager}</option>
              ))}
            </FilterSelect>
          </FilterColumn>
        </FilterRow>
        
        {hasActiveFilters() && (
          <FilterTags>
            {Object.entries(filters).filter(([key, value]) => value !== '').map(([key, value]) => (
              <FilterTag key={key}>
                {translateFilterKey(key)}: {value}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  onClick={() => handleFilterChange(key, '')}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </FilterTag>
            ))}
            {searchTerm && (
              <FilterTag>
                Arama: {searchTerm}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  onClick={() => setSearchTerm('')}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </FilterTag>
            )}
            <ClearAllButton onClick={clearFilters}>
              Tüm filtreleri temizle
            </ClearAllButton>
          </FilterTags>
        )}
        
        <FilterActions>
          <FilterButton className="search" onClick={applyFilters}>
            <SearchIcon />
            Filtrele
          </FilterButton>
          
          <FilterButton className="clear" onClick={clearFilters}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Temizle
          </FilterButton>
        </FilterActions>
      </FilterPanel>
    );
  };

  return (
    <StyledCard>
      <StyledCardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClinicIcon style={{ marginRight: '10px' }} />
            <h2 style={{ margin: 0 }}>Klinikler</h2>
          </div>
          <Link to="/klinik/create" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
            <PlusIcon />
            <span>Yeni Klinik</span>
          </Link>
        </div>
      </StyledCardHeader>

      <StyledCardBody>
        {error && (
          <div style={{ padding: '16px', backgroundColor: '#fee8e7', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        {renderFilterPanel()}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>
            <strong>{filteredData.length}</strong> klinik {hasActiveFilters() ? '(filtrelenmiş)' : ''}
          </div>
          
          <button 
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', backgroundColor: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
            onClick={fetchClinics}
            disabled={loading}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            Yenile
          </button>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #f3f4f6', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            noDataComponent={
              <div style={{ padding: '20px', textAlign: 'center', color: '#4b5563', backgroundColor: '#f9fafb', borderRadius: '6px', margin: '20px 0' }}>
                {searchTerm || hasActiveFilters() ? 
                  'Arama kriterlerinize uygun klinik bulunamadı.' : 
                  'Henüz klinik bulunmamaktadır. Yeni bir klinik eklemek için "Yeni Klinik" butonuna tıklayın.'}
              </div>
            }
            highlightOnHover
            pointerOnHover
            persistTableHead
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
          />
        )}
      </StyledCardBody>
    </StyledCard>
  );
};

export default ClinicList; 