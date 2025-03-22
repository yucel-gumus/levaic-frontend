import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { clinicService } from '../../services/api';
import { deleteClinic } from '../../services/clinicApi';
import { 
  ClinicIcon, 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  EditIcon,
  TrashIcon
} from '../../components/icons';
import {
  StyledCard,
  StyledCardHeader,
  StyledCardBody,
  StatusBadge,
  FilterPanel,
  FilterTitle,
  FilterRow,
  FilterColumn,
  FilterLabel,
  FilterInput,
  FilterSelect,
  SearchIconWrapper,
  PrimaryButton,
  SecondaryButton,
  ButtonGroup,
  ActionHeader,
  dataTableCustomStyles,
  FilterTags,
  FilterTag,
  ClearAllButton,
  FilterActions,
  FilterButton
} from '../../components/common/common.styles';

// Ana bileşen
const ClinicList = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
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
        clinic.sehir?.toLowerCase().includes(searchLower) ||
        (clinic.yonetici_ad && clinic.yonetici_soyad && 
          `${clinic.yonetici_ad} ${clinic.yonetici_soyad}`.toLowerCase().includes(searchLower)) ||
        clinic.iletisim_numarasi?.includes(searchTerm)
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
        clinic.yonetici_ad && clinic.yonetici_soyad && 
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
        <ActionHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClinicIcon style={{ marginRight: '10px', fontSize: '1.4rem', color: '#2563eb' }} />
            <h2>Klinikler</h2>
          </div>
          
          <ButtonGroup>
            <SecondaryButton 
              onClick={() => setShowFilters(!showFilters)}
              style={{ marginRight: '10px' }}
            >
              <FilterIcon />
              Filtrele
            </SecondaryButton>
            
            <PrimaryButton as={Link} to="/klinik/create">
              <PlusIcon />
              Yeni Klinik
            </PrimaryButton>
          </ButtonGroup>
        </ActionHeader>
      </StyledCardHeader>
      
      {showFilters && renderFilterPanel()}
      
      <StyledCardBody>
        {loading ? (
          <div>Yükleniyor...</div>
        ) : error ? (
          <div>{error}</div>
        ) : filteredData.length === 0 ? (
          <div>Klinik bulunamadı.</div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            customStyles={dataTableCustomStyles}
            progressPending={loading || deleting}
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