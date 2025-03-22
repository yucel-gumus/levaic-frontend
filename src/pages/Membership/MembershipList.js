import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { membershipService } from '../../services/api';
import { formatISODateToLocalDate, formatApiError } from '../../services/utils';
import { CINSIYET_OPTIONS } from '../../constants';
import { 
  UserIcon, 
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
const MembershipList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtre durumları
  const [filters, setFilters] = useState({
    cinsiyet: '',
    durum: '',
    klinik: ''
  });

  // Durum seçenekleri
  const durumOptions = useMemo(() => ['Aktif', 'Pasif'], []);

  // Üyeleri yükleme
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await membershipService.getAll();
      
      // API'den gelen verileri formatlama
      const formattedMembers = response.data.map(member => ({
        ...member,
        dogum_tarihi: formatISODateToLocalDate(member.dogum_tarihi),
        klinik_adi: member.klinik ? member.klinik.ad : 'Belirtilmemiş'
      }));
      
      setMembers(formattedMembers);
      setError(null);
    } catch (err) {
      setError('Üyeler yüklenirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Üye silme işlemi
  const handleDelete = async (id) => {
    if (window.confirm('Bu üyeyi silmek istediğinize emin misiniz?')) {
      try {
        setLoading(true);
        await membershipService.delete(id);
        setMembers(members.filter(member => member._id !== id));
      } catch (err) {
        setError('Üye silinirken bir hata oluştu: ' + err.message);
      } finally {
        setLoading(false);
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
      cinsiyet: '',
      durum: '',
      klinik: ''
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
      cinsiyet: 'Cinsiyet',
      durum: 'Durum',
      klinik: 'Klinik'
    };
    return translations[key] || key;
  };

  // Klinik seçenekleri - benzersiz klinikleri al
  const klinikler = useMemo(() => {
    if (!members.length) return [];
    return [...new Set(members.map(member => member.klinik_adi).filter(Boolean))].sort();
  }, [members]);

  // Cinsiyet formatını daha okunabilir hale getir
  const formatCinsiyet = useCallback((value) => {
    const option = CINSIYET_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : value;
  }, []);

  // DataTable sütun tanımları
  const columns = useMemo(() => [
    {
      name: 'Ad Soyad',
      selector: row => `${row.ad} ${row.soyad}`,
      sortable: true,
      cell: row => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '10px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9ff', borderRadius: '50%', color: '#2563eb' }}>
            <UserIcon />
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{row.ad} {row.soyad}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      name: 'İletişim',
      selector: row => row.iletisim_numarasi,
      sortable: true
    },
    {
      name: 'Klinik',
      selector: row => row.klinik_adi,
      sortable: true
    },
    {
      name: 'Doğum Tarihi',
      selector: row => row.dogum_tarihi,
      sortable: true
    },
    {
      name: 'Cinsiyet',
      selector: row => formatCinsiyet(row.cinsiyet),
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
            to={`/uyelik/${row._id}/duzenle`}
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
  ], [formatCinsiyet, handleDelete]);

  // Filtrelenmiş veriler
  const filteredData = useMemo(() => {
    let filtered = [...members];
    
    // Arama terimine göre filtreleme
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(member =>
        member.ad.toLowerCase().includes(searchLower) ||
        member.soyad.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.iletisim_numarasi.includes(searchTerm) ||
        member.klinik_adi.toLowerCase().includes(searchLower)
      );
    }
    
    // Cinsiyet filtrelemesi
    if (filters.cinsiyet) {
      filtered = filtered.filter(member => member.cinsiyet === filters.cinsiyet);
    }

    // Durum filtrelemesi
    if (filters.durum) {
      filtered = filtered.filter(member => member.durum === filters.durum);
    }
    
    // Klinik filtrelemesi
    if (filters.klinik) {
      filtered = filtered.filter(member => member.klinik_adi === filters.klinik);
    }
    
    return filtered;
  }, [members, searchTerm, filters]);

  // Filtreleme paneli
  const renderFilterPanel = () => {
    return (
      <FilterPanel>
        <FilterTitle>
          <FilterIcon />
          Üye Filtrele
        </FilterTitle>
        
        <FilterRow>
          <FilterColumn>
            <FilterLabel htmlFor="nameSearch">Üye Ara</FilterLabel>
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
            <FilterLabel htmlFor="klinikFilter">Klinik</FilterLabel>
            <FilterSelect
              id="klinikFilter"
              value={filters.klinik}
              onChange={(e) => handleFilterChange('klinik', e.target.value)}
            >
              <option value="">Tümü</option>
              {klinikler.map((klinik, index) => (
                <option key={index} value={klinik}>{klinik}</option>
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
            <UserIcon style={{ marginRight: '10px', fontSize: '1.4rem', color: '#2563eb' }} />
            <h2>Üyeler</h2>
          </div>
          
          <ButtonGroup>
            <SecondaryButton 
              onClick={() => setShowFilters(!showFilters)}
              style={{ marginRight: '10px' }}
            >
              <FilterIcon />
              Filtrele
            </SecondaryButton>
            
            <PrimaryButton as={Link} to="/uyelik/yeni">
              <PlusIcon />
              Yeni Üye Ekle
            </PrimaryButton>
          </ButtonGroup>
        </ActionHeader>
      </StyledCardHeader>
      
      {showFilters && renderFilterPanel()}
      
      <StyledCardBody>
        {loading ? (
          <div>Yükleniyor...</div>
        ) : error ? (
          <div style={{ padding: '16px', backgroundColor: '#fee8e7', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px' }}>
            {error}
          </div>
        ) : members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ marginBottom: '16px', color: '#6b7280' }}>Henüz kaydedilmiş üye bulunmamaktadır.</p>
            <PrimaryButton as={Link} to="/uyelik/yeni">
              <PlusIcon style={{ marginRight: '8px' }} /> 
              İlk Üyeyi Ekle
            </PrimaryButton>
          </div>
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

export default MembershipList; 