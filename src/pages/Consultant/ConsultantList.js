import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { getConsultants, deleteConsultant } from '../../services/consultantApi';
import { formatISODateToLocalDate, formatApiError } from '../../services/utils';
import { CINSIYET_OPTIONS, UZMANLIK_ALANLARI_OPTIONS } from '../../constants';
import { 
  UserIcon, 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  EditIcon, 
  TrashIcon,
  ConsultantIcon
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
  ActionButton,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  EditButton,
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
const ConsultantList = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    cinsiyet: '',
    durum: '',
    uzmanlik: ''
  });
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Durum seçenekleri
  const durumOptions = useMemo(() => ['Aktif', 'Pasif'], []);

  // Uzmanlık alanları
  const specialtyOptions = useMemo(() => {
    if (!consultants.length) return [];
    
    return [...new Set(consultants
      .map(c => c.uzmanlik)
      .filter(Boolean))]
      .sort();
  }, [consultants]);

  // Danışman listesini yükle
  const fetchConsultants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getConsultants();
      
      // API'den gelen verileri formatlama
      const formattedConsultants = response.data.map(consultant => ({
        ...consultant,
        dogum_tarihi: formatISODateToLocalDate(consultant.dogum_tarihi),
        klinik_adi: consultant.klinik ? consultant.klinik.ad : 'Belirtilmemiş'
      }));
      
      setConsultants(formattedConsultants);
    } catch (err) {
      setError('Danışmanlar yüklenirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultants();
  }, [fetchConsultants]);

  // Danışman silme işlemi
  const handleDeleteConsultant = useCallback(async (id) => {
    if (!window.confirm('Bu danışmanı silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteConsultant(id);
      await fetchConsultants();
      alert('Danışman başarıyla silindi.');
    } catch (err) {
      setError('Danışman silinirken bir hata oluştu: ' + err.message);
      alert(`Hata: ${formatApiError(err)}`);
    } finally {
      setLoading(false);
    }
  }, [fetchConsultants]);

  // Filtre değişikliklerini işle
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtreleri temizle
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      cinsiyet: '',
      durum: '',
      uzmanlik: ''
    });
    setResetPaginationToggle(!resetPaginationToggle);
  };

  // Aktif filtrelerin olup olmadığını kontrol et
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '') || searchTerm !== '';
  };

  // Filtre anahtarlarını tercüme et
  const translateFilterKey = (key) => {
    const translations = {
      cinsiyet: 'Cinsiyet',
      durum: 'Durum',
      uzmanlik: 'Uzmanlık'
    };
    return translations[key] || key;
  };

  // Cinsiyet değerini formatla
  const formatCinsiyet = (value) => {
    const option = CINSIYET_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  // Filtreleme paneli
  const renderFilterPanel = () => {
    return (
      <FilterPanel>
        <FilterTitle>
          <FilterIcon />
          Danışman Filtrele
        </FilterTitle>
        
        <FilterRow>
          <FilterColumn>
            <FilterLabel htmlFor="nameSearch">Danışman Ara</FilterLabel>
            <SearchIconWrapper>
              <SearchIcon />
              <FilterInput
                id="nameSearch"
                type="text"
                placeholder="Ad, soyad, e-posta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                hasIcon={true}
              />
            </SearchIconWrapper>
          </FilterColumn>
          
          <FilterColumn>
            <FilterLabel htmlFor="cinsiyetFilter">Cinsiyet</FilterLabel>
            <FilterSelect
              id="cinsiyetFilter"
              value={filters.cinsiyet}
              onChange={(e) => handleFilterChange('cinsiyet', e.target.value)}
            >
              <option value="">Tümü</option>
              {CINSIYET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </FilterSelect>
          </FilterColumn>
          
          <FilterColumn>
            <FilterLabel htmlFor="durumFilter">Durum</FilterLabel>
            <FilterSelect
              id="durumFilter"
              value={filters.durum}
              onChange={(e) => handleFilterChange('durum', e.target.value)}
            >
              <option value="">Tümü</option>
              {durumOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </FilterSelect>
          </FilterColumn>
          
          <FilterColumn>
            <FilterLabel htmlFor="uzmanlikFilter">Uzmanlık</FilterLabel>
            <FilterSelect
              id="uzmanlikFilter"
              value={filters.uzmanlik}
              onChange={(e) => handleFilterChange('uzmanlik', e.target.value)}
            >
              <option value="">Tümü</option>
              {specialtyOptions.map((specialty, index) => (
                <option key={index} value={specialty}>{specialty}</option>
              ))}
            </FilterSelect>
          </FilterColumn>
        </FilterRow>
        
        {hasActiveFilters() && (
          <FilterTags>
            {Object.entries(filters).filter(([key, value]) => value !== '').map(([key, value]) => (
              <FilterTag key={key}>
                {translateFilterKey(key)}: {key === 'cinsiyet' ? formatCinsiyet(value) : value}
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
            <button 
              onClick={handleClearFilters}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '0',
                marginLeft: '10px',
                textDecoration: 'underline'
              }}
            >
              Tüm filtreleri temizle
            </button>
          </FilterTags>
        )}
        
        <FilterActions>
          <FilterButton 
            className="clear" 
            onClick={handleClearFilters}
          >
            Filtreleri Temizle
          </FilterButton>
        </FilterActions>
      </FilterPanel>
    );
  };

  // Filtrelenmiş danışmanlar
  const filteredData = useMemo(() => {
    let filtered = [...consultants];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(consultant => 
        consultant.ad.toLowerCase().includes(searchLower) ||
        consultant.soyad.toLowerCase().includes(searchLower) ||
        consultant.email.toLowerCase().includes(searchLower) ||
        consultant.iletisim_numarasi.includes(searchTerm) ||
        (consultant.uzmanlik && consultant.uzmanlik.toLowerCase().includes(searchLower)) ||
        (consultant.klinik_adi && consultant.klinik_adi.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.cinsiyet) {
      filtered = filtered.filter(consultant => consultant.cinsiyet === filters.cinsiyet);
    }
    
    if (filters.durum) {
      filtered = filtered.filter(consultant => consultant.durum === filters.durum);
    }
    
    if (filters.uzmanlik) {
      filtered = filtered.filter(consultant => consultant.uzmanlik === filters.uzmanlik);
    }
    
    return filtered;
  }, [consultants, searchTerm, filters]);

  // DataTable sütunları
  const columns = useMemo(() => [
    {
      name: 'Danışman',
      selector: row => `${row.ad} ${row.soyad}`,
      sortable: true,
      cell: row => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            marginRight: '10px', 
            width: '32px', 
            height: '32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '50%', 
            color: '#2563eb' 
          }}>
            <ConsultantIcon />
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{row.ad} {row.soyad}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{row.uzmanlik || 'Belirtilmemiş'}</div>
          </div>
        </div>
      )
    },
    {
      name: 'E-posta',
      selector: row => row.email,
      sortable: true,
      cell: row => (
        <a 
          href={`mailto:${row.email}`} 
          style={{ color: '#3182ce', textDecoration: 'none' }}
        >
          {row.email}
        </a>
      )
    },
    {
      name: 'Telefon',
      selector: row => row.iletisim_numarasi,
      sortable: true,
      cell: row => (
        <a 
          href={`tel:${row.iletisim_numarasi}`} 
          style={{ color: '#3182ce', textDecoration: 'none' }}
        >
          {row.iletisim_numarasi}
        </a>
      )
    },
    {
      name: 'Klinik',
      selector: row => row.klinik_adi,
      sortable: true,
    },
    {
      name: 'Tecrübe',
      selector: row => row.tecrube_yili,
      sortable: true,
      cell: row => (
        <span style={{
          background: '#edf2f7',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {row.tecrube_yili} yıl
        </span>
      )
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
            to={`/danisman/${row._id}/duzenle`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              borderRadius: '6px' 
            }}
            title="Düzenle"
          >
            <EditIcon />
          </Link>
          <button 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#ef4444', 
              color: 'white', 
              borderRadius: '6px', 
              border: 'none', 
              cursor: 'pointer' 
            }}
            onClick={() => handleDeleteConsultant(row._id)}
            title="Sil"
          >
            <TrashIcon />
          </button>
        </div>
      )
    }
  ], [handleDeleteConsultant]);

  return (
    <StyledCard>
      <StyledCardHeader>
        <ActionHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ConsultantIcon style={{ marginRight: '10px', fontSize: '1.4rem', color: '#2563eb' }} />
            <h2>Danışmanlar</h2>
          </div>
          
          <ButtonGroup>
            <SecondaryButton 
              onClick={() => setShowFilters(!showFilters)}
              style={{ marginRight: '10px' }}
            >
              <FilterIcon />
              Filtrele
            </SecondaryButton>
            
            <PrimaryButton as={Link} to="/danisman/yeni">
              <PlusIcon />
              Yeni Danışman
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
          <div>Danışman bulunamadı.</div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            customStyles={dataTableCustomStyles}
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

export default ConsultantList; 