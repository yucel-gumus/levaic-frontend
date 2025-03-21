import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import { getServices, deleteService } from '../services/serviceApi';
import { 
  FilterIcon, 
  SearchIcon, 
  PlusIcon, 
  EditIcon,
  TrashIcon
} from '../components/icons';
import { HIZMET_KATEGORILERI, HIZMET_DURUMLARI } from '../constants';

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

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    hizmet_adi: '',
    hizmet_kategorisi: '',
    durum: '',
    telemed_hizmeti: ''
  });
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    // Filtreleri uygula
    filterServices();
  }, [services, activeFilters]);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
      setFilteredServices(data);
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

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
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
    setFilteredServices(services);
  };

  const applyFilters = () => {
    // Boş olmayan filtreleri alıp active filters'a ekle
    const newActiveFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        newActiveFilters[key] = filters[key];
      }
    });
    setActiveFilters(newActiveFilters);
  };

  const hasActiveFilters = () => {
    return Object.keys(activeFilters).length > 0;
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

  const filterServices = () => {
    if (!hasActiveFilters()) {
      setFilteredServices(services);
      return;
    }

    const filtered = services.filter(service => {
      return Object.keys(activeFilters).every(key => {
        const filterValue = activeFilters[key].toLowerCase();
        if (key === 'telemed_hizmeti') {
          if (filterValue === 'evet') {
            return service.telemed_hizmeti === true;
          } else if (filterValue === 'hayır') {
            return service.telemed_hizmeti === false;
          }
          return true;
        }
        
        const serviceValue = String(service[key] || '').toLowerCase();
        return serviceValue.includes(filterValue);
      });
    });

    setFilteredServices(filtered);
  };

  // Filtreleme panelini render et
  const renderFilterPanel = () => {
    return (
      <FilterPanel>
        <FilterTitle>
          <FilterIcon /> Hizmet Filtreleme
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
          <FilterButton className="search" onClick={applyFilters}>
            <SearchIcon /> Filtrele
          </FilterButton>
          <FilterButton className="clear" onClick={clearFilters}>
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </FilterTag>
            ))}
            <ClearAllButton onClick={clearFilters}>Tümünü Temizle</ClearAllButton>
          </FilterTags>
        )}
      </FilterPanel>
    );
  };

  // DataTable sütun tanımları
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
      selector: row => `${row.sure.saat}s ${row.sure.dakika}d`,
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
      cell: row => (
        <div className="btn-group">
          <Link 
            to={`/hizmet/duzenle/${row._id}`} 
            className="btn btn-sm btn-outline-primary"
          >
            <EditIcon />
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            className="btn btn-sm btn-outline-danger"
          >
            <TrashIcon />
          </button>
        </div>
      ),
      button: true
    }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StyledCard>
        <StyledCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="m-0 font-weight-bold">Hizmetler</h5>
          <Link to="/hizmet/ekle" className="btn btn-primary">
            <PlusIcon className="me-2" /> Yeni Hizmet Ekle
          </Link>
        </StyledCardHeader>
        
        <StyledCardBody>
          {error && (
            <div className="alert alert-danger mb-4">{error}</div>
          )}
          
          {renderFilterPanel()}
          
          <DataTable
            columns={columns}
            data={filteredServices}
            pagination
            responsive
            striped
            highlightOnHover
            pointerOnHover
            noDataComponent="Gösterilecek hizmet bulunamadı."
          />
        </StyledCardBody>
      </StyledCard>
    </div>
  );
};

export default Services; 