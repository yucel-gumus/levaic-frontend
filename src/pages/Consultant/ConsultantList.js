import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import { consultantService } from '../../services/api';
import { formatISODateToLocalDate, formatApiError } from '../../services/utils';
import { CINSIYET_OPTIONS, UZMANLIK_ALANLARI_OPTIONS } from '../../constants';

// İkonlar
const ConsultantIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

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
    props.status === 'Aktif' ? '#e6f7ee' : '#fee8e7'};
  color: ${props => 
    props.status === 'Aktif' ? '#0d6832' : '#d63031'};
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
  margin-top: 10px;
`;

const FilterTag = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: #f1f5f9;
  border-radius: 20px;
  font-size: 12px;
  color: #475569;
  
  svg {
    cursor: pointer;
    color: #94a3b8;
    
    &:hover {
      color: #475569;
    }
  }
`;

/**
 * Danışman listesi sayfası bileşeni
 * @returns {JSX.Element}
 */
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
      const response = await consultantService.getConsultants();
      
      // API'den gelen verileri formatlama
      const formattedConsultants = response.data.map(consultant => ({
        ...consultant,
        dogum_tarihi: formatISODateToLocalDate(consultant.dogum_tarihi),
        klinik_adi: consultant.klinik ? consultant.klinik.ad : 'Belirtilmemiş'
      }));
      
      setConsultants(formattedConsultants);
    } catch (err) {
      console.error('Danışmanlar yüklenirken hata:', err);
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultants();
  }, [fetchConsultants]);

  // Danışman silme işlemi
  const handleDeleteConsultant = useCallback(async (id) => {
    if (!window.confirm('Bu danışmanı silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      setLoading(true);
      await consultantService.deleteConsultant(id);
      await fetchConsultants();
      alert('Danışman başarıyla silindi.');
    } catch (err) {
      console.error('Danışman silinemedi:', err);
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ConsultantIcon style={{ marginRight: '10px' }} />
            <h2 style={{ margin: 0 }}>Danışmanlar</h2>
          </div>
          <Link to="/danisman/yeni" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
            <PlusIcon />
            <span>Yeni Danışman</span>
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
            <strong>{filteredData.length}</strong> danışman {hasActiveFilters() ? '(filtrelenmiş)' : ''}
          </div>
          
          <button 
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', backgroundColor: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
            onClick={fetchConsultants}
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
                  'Arama kriterlerinize uygun danışman bulunamadı.' : 
                  'Henüz danışman bulunmamaktadır. Yeni bir danışman eklemek için "Yeni Danışman" butonuna tıklayın.'}
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

export default ConsultantList; 