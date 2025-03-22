import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { serviceService, deleteService } from '../services/serviceApi';
import { 
  FilterIcon, 
  SearchIcon, 
  PlusIcon, 
  EditIcon,
  TrashIcon,
  ServiceIcon
} from '../components/icons';
import { HIZMET_KATEGORILERI, HIZMET_DURUMLARI } from '../constants';
import { toast } from 'react-hot-toast';
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
} from '../components/common/common.styles';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [filters, setFilters] = useState({
    hizmet_adi: '',
    hizmet_kategorisi: '',
    durum: '',
    telemed_hizmeti: ''
  });
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  // Önce hasActiveFilters fonksiyonunu tanımla
  const hasActiveFilters = () => {
    return Object.keys(activeFilters).length > 0;
  };

  // Sonra filterServices tanımla
  const filterServices = useCallback(() => {
    if (!hasActiveFilters()) {
      setFilteredServices(services);
      return;
    }

    const filtered = services.filter(service => {
      return Object.keys(activeFilters).every(key => {
        const filterValue = activeFilters[key].toLowerCase();
        
        // Telemed hizmeti kontrolü
        if (key === 'telemed_hizmeti') {
          if (filterValue === 'evet') {
            return service.telemed_hizmeti === true;
          } else if (filterValue === 'hayır') {
            return service.telemed_hizmeti === false;
          }
          return true;
        }
        
        // Diğer string alanlar için kontrol
        const serviceValue = String(service[key] || '').toLowerCase();
        return serviceValue.includes(filterValue);
      });
    });

    setFilteredServices(filtered);
  }, [services, activeFilters, hasActiveFilters]);

  // Sonra useEffect tanımı
  useEffect(() => {
    // Filtreleri uygula
    filterServices();
  }, [services, activeFilters, filterServices]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const { data } = await serviceService.getAll();
      setServices(data);
      setFilteredServices(data);
      setError(null);
    } catch (err) {
      setError('Hizmetler yüklenirken bir hata oluştu');
      toast.error('Hizmetler yüklenirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Güvenlik için fetchServices fonksiyonunu loadServices olarak yeniden adlandırıyorum
  const fetchServices = loadServices;

  const handleDelete = async (id) => {
    if (!window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      setDeleting(id);
      await deleteService(id);
      fetchServices();
      toast.success('Hizmet başarıyla silindi');
    } catch (err) {
      toast.error('Hizmet silinirken bir hata oluştu: ' + err.message);
      setError('Hizmet silinirken bir hata oluştu');
    } finally {
      setDeleting(null);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [name]: value
      };
      
      // Yeni aktif filtreleri oluştur
      const newActiveFilters = {};
      Object.keys(newFilters).forEach(key => {
        if (newFilters[key]) {
          newActiveFilters[key] = newFilters[key];
        }
      });
      
      // Aktif filtreleri güncelle
      setActiveFilters(newActiveFilters);
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      hizmet_adi: '',
      hizmet_kategorisi: '',
      durum: '',
      telemed_hizmeti: ''
    });
    setActiveFilters({});
  };

  const translateFilterKey = (key) => {
    const translations = {
      hizmet_adi: 'Hizmet Adı',
      hizmet_kategorisi: 'Kategori',
      durum: 'Durum',
      telemed_hizmeti: 'Telemed Hizmeti'
    };
    return translations[key] || key;
  };

  // Filtreleme panelini render et
  const renderFilterPanel = () => {
    return (
      <FilterPanel>
        <FilterTitle>
          <FilterIcon /> 
          Hizmet Filtreleme
        </FilterTitle>
        
        <FilterRow>
          <FilterColumn>
            <FilterLabel>Hizmet Adı</FilterLabel>
            <SearchIconWrapper>
              <SearchIcon />
              <FilterInput 
                type="text"
                placeholder="Hizmet adı ara..."
                value={filters.hizmet_adi}
                onChange={(e) => handleFilterChange('hizmet_adi', e.target.value)}
                hasIcon
              />
            </SearchIconWrapper>
          </FilterColumn>
          
          <FilterColumn>
            <FilterLabel>Kategori</FilterLabel>
            <FilterSelect
              value={filters.hizmet_kategorisi}
              onChange={(e) => handleFilterChange('hizmet_kategorisi', e.target.value)}
            >
              <option value="">Tüm Kategoriler</option>
              {HIZMET_KATEGORILERI.map(kategori => (
                <option key={kategori.value} value={kategori.value}>
                  {kategori.label}
                </option>
              ))}
            </FilterSelect>
          </FilterColumn>
          
          <FilterColumn>
            <FilterLabel>Durum</FilterLabel>
            <FilterSelect
              value={filters.durum}
              onChange={(e) => handleFilterChange('durum', e.target.value)}
            >
              <option value="">Tüm Durumlar</option>
              {HIZMET_DURUMLARI.map(durum => (
                <option key={durum.value} value={durum.value}>
                  {durum.label}
                </option>
              ))}
            </FilterSelect>
          </FilterColumn>
          
          <FilterColumn>
            <FilterLabel>Telemed Hizmeti</FilterLabel>
            <FilterSelect
              value={filters.telemed_hizmeti}
              onChange={(e) => handleFilterChange('telemed_hizmeti', e.target.value)}
            >
              <option value="">Hepsi</option>
              <option value="evet">Evet</option>
              <option value="hayır">Hayır</option>
            </FilterSelect>
          </FilterColumn>
        </FilterRow>
        
        <FilterActions>
          <FilterButton className="search" onClick={filterServices}>
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
        
        {hasActiveFilters() && (
          <FilterTags>
            {Object.entries(activeFilters).map(([key, value]) => (
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
                  onClick={() => {
                    const newActiveFilters = { ...activeFilters };
                    delete newActiveFilters[key];
                    setActiveFilters(newActiveFilters);
                  }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </FilterTag>
            ))}
            {filters.hizmet_adi && (
              <FilterTag>
                Arama: {filters.hizmet_adi}
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
                  onClick={() => handleFilterChange('hizmet_adi', '')}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </FilterTag>
            )}
            <ClearAllButton onClick={clearFilters}>Tüm filtreleri temizle</ClearAllButton>
          </FilterTags>
        )}
      </FilterPanel>
    );
  };

  // DataTable sütunları tanımla
  const columns = [
    {
      name: 'Hizmet Adı',
      selector: row => row.hizmet_adi,
      sortable: true
    },
    {
      name: 'Kategori',
      selector: row => row.hizmet_kategorisi,
      sortable: true
    },
    {
      name: 'Ücret',
      selector: row => row.ucret,
      format: row => `₺${row.ucret}`,
      sortable: true
    },
    {
      name: 'Süre',
      selector: row => {
        if (!row.sure || typeof row.sure !== 'object') return 'Belirtilmemiş';
        return `${row.sure.saat || 0}s ${row.sure.dakika || 0}d`;
      },
      sortable: true
    },
    {
      name: 'Telemed',
      cell: row => (
        <StatusBadge status={row.telemed_hizmeti ? 'Aktif' : 'Pasif'}>
          {row.telemed_hizmeti ? 'Evet' : 'Hayır'}
        </StatusBadge>
      ),
      sortable: true
    },
    {
      name: 'Durum',
      cell: row => (
        <StatusBadge status={row.durum}>
          {row.durum}
        </StatusBadge>
      ),
      sortable: true
    },
    {
      name: 'İşlemler',
      selector: row => row._id,
      cell: row => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link 
            to={`/hizmet/duzenle/${row._id}`} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: '#2563eb', color: 'white', borderRadius: '6px' }}
            title="Düzenle"
          >
            <EditIcon />
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
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
            title="Sil"
            disabled={deleting === row._id}
          >
            {deleting === row._id ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <TrashIcon />
            )}
          </button>
        </div>
      ),
      button: true
    }
  ];

  if (loading) {
    return (
      <StyledCard>
        <StyledCardHeader>
          <ActionHeader>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ServiceIcon style={{ marginRight: '10px', fontSize: '1.4rem', color: '#2563eb' }} />
              <h2>Hizmetler</h2>
            </div>
          </ActionHeader>
        </StyledCardHeader>
        <StyledCardBody>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Yükleniyor...</div>
        </StyledCardBody>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <StyledCardHeader>
        <ActionHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ServiceIcon style={{ marginRight: '10px', fontSize: '1.4rem', color: '#2563eb' }} />
            <h2>Hizmetler</h2>
          </div>
          
          <ButtonGroup>
            <SecondaryButton 
              onClick={() => setShowFilters(!showFilters)}
              style={{ marginRight: '10px' }}
            >
              <FilterIcon />
              Filtrele
            </SecondaryButton>
            
            <PrimaryButton as={Link} to="/hizmet/ekle">
              <PlusIcon />
              Yeni Hizmet
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
        ) : filteredServices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ marginBottom: '16px', color: '#6b7280' }}>Gösterilecek hizmet bulunmamaktadır.</p>
            <PrimaryButton as={Link} to="/hizmet/ekle">
              <PlusIcon style={{ marginRight: '8px' }} /> 
              Yeni Hizmet Ekle
            </PrimaryButton>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredServices}
            pagination
            paginationResetDefaultPage={false}
            customStyles={dataTableCustomStyles}
            progressPending={loading || Boolean(deleting)}
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

export default Services; 