import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { appointmentService } from '../../services/appointmentApi';
import { formatApiError } from '../../services/utils';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';
import { 
  CalendarIcon, 
  PlusIcon, 
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
  PrimaryButton,
  SecondaryButton,
  ButtonGroup,
  ActionHeader,
  dataTableCustomStyles
} from '../../components/common/common.styles';

const RANDEVU_DURUM_OPTIONS = [
  { value: 'Beklemede', label: 'Beklemede' },
  { value: 'Onaylandı', label: 'Onaylandı' },
  { value: 'İptal Edildi', label: 'İptal Edildi' },
  { value: 'Tamamlandı', label: 'Tamamlandı' }
];

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  
  // Filtreleme durumları
  const [filters, setFilters] = useState({
    klinik: '',
    danisman: '',
    durum: '',
    tarih_baslangic: '',
    tarih_bitis: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, perPage]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getAll();
      if (response && response.data) {
        setAppointments(response.data);
        setTotalRows(response.data.length);
      } else {
        setAppointments([]);
      }
      setError(null);
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      toast.error('Randevular yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    
    try {
      await appointmentService.delete(selectedAppointment._id);
      toast.success('Randevu başarıyla silindi');
      setAppointments(appointments.filter(a => a._id !== selectedAppointment._id));
      setShowDeleteModal(false);
      setSelectedAppointment(null);
    } catch (err) {
      const errorMessage = formatApiError(err);
      toast.error(`Randevu silinemedi: ${errorMessage}`);
    }
  };

  const confirmDelete = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      klinik: '',
      danisman: '',
      durum: '',
      tarih_baslangic: '',
      tarih_bitis: '',
    });
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchAppointments();
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };

  const translateFilterKey = (key) => {
    const translations = {
      klinik: 'Klinik',
      danisman: 'Danışman',
      durum: 'Durum',
      tarih_baslangic: 'Başlangıç Tarihi',
      tarih_bitis: 'Bitiş Tarihi',
    };
    return translations[key] || key;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return dateString || 'Geçersiz tarih';
    }
  };

  const columns = [
    {
      name: 'Klinik',
      selector: row => row.klinik?.ad || '',
      sortable: true,
    },
    {
      name: 'Danışmanlar',
      selector: row => {
        if (!row.danismanlar || !Array.isArray(row.danismanlar)) return '';
        return row.danismanlar
          .map(d => typeof d === 'object' ? `${d.ad} ${d.soyad}` : '')
          .filter(Boolean)
          .join(', ');
      },
      wrap: true,
    },
    {
      name: 'Tarih',
      selector: row => formatDate(row.tarih),
      sortable: true,
    },
    {
      name: 'Durum',
      selector: row => row.durum,
      sortable: true,
      cell: row => (
        <StatusBadge status={row.durum}>{row.durum}</StatusBadge>
      ),
    },
    {
      name: 'İşlemler',
      cell: row => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link 
            to={`/randevu/duzenle/${row._id}`}
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
            onClick={() => confirmDelete(row)}
            title="Sil"
          >
            <TrashIcon />
          </button>
        </div>
      ),
      button: true,
    },
  ];

  const renderFilterPanel = () => {
    return (
      <FilterPanel>
        <FilterTitle>
          <FilterIcon /> Randevu Filtreleme
        </FilterTitle>
        <FilterRow>
          <FilterColumn>
            <FilterLabel>Klinik</FilterLabel>
            <FilterInput 
              type="text" 
              placeholder="Klinik adı ile ara..."
              value={filters.klinik}
              onChange={(e) => handleFilterChange('klinik', e.target.value)}
            />
          </FilterColumn>
          <FilterColumn>
            <FilterLabel>Danışman</FilterLabel>
            <FilterInput 
              type="text" 
              placeholder="Danışman adı ile ara..."
              value={filters.danisman}
              onChange={(e) => handleFilterChange('danisman', e.target.value)}
            />
          </FilterColumn>
          <FilterColumn>
            <FilterLabel>Durum</FilterLabel>
            <FilterSelect
              value={filters.durum}
              onChange={(e) => handleFilterChange('durum', e.target.value)}
            >
              <option value="">Tüm Durumlar</option>
              {RANDEVU_DURUM_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>
          </FilterColumn>
        </FilterRow>
        <FilterRow>
          <FilterColumn>
            <FilterLabel>Başlangıç Tarihi</FilterLabel>
            <FilterInput 
              type="date" 
              value={filters.tarih_baslangic}
              onChange={(e) => handleFilterChange('tarih_baslangic', e.target.value)}
            />
          </FilterColumn>
          <FilterColumn>
            <FilterLabel>Bitiş Tarihi</FilterLabel>
            <FilterInput 
              type="date" 
              value={filters.tarih_bitis}
              onChange={(e) => handleFilterChange('tarih_bitis', e.target.value)}
            />
          </FilterColumn>
          <FilterColumn style={{display: 'flex', alignItems: 'flex-end'}}>
            <div style={{display: 'flex', gap: '10px', width: '100%'}}>
              <PrimaryButton 
                onClick={applyFilters}
                style={{flex: 1}}
              >
                Filtrele
              </PrimaryButton>
              <SecondaryButton 
                onClick={clearFilters}
                style={{flex: 1}}
              >
                Temizle
              </SecondaryButton>
            </div>
          </FilterColumn>
        </FilterRow>
        {hasActiveFilters() && (
          <div style={{marginTop: '10px', fontSize: '0.9rem', color: '#4a5568'}}>
            <strong>Aktif Filtreler:</strong> {Object.entries(filters)
              .filter(([_, value]) => value !== '')
              .map(([key, value]) => `${translateFilterKey(key)}: ${value}`)
              .join(', ')}
          </div>
        )}
      </FilterPanel>
    );
  };

  return (
    <>
      <StyledCard>
        <StyledCardHeader>
          <ActionHeader>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon style={{ marginRight: '10px', fontSize: '1.4rem', color: '#2563eb' }} />
              <h2>Randevular</h2>
            </div>
            
            <ButtonGroup>
              <SecondaryButton 
                onClick={() => setShowFilters(!showFilters)}
                style={{ marginRight: '10px' }}
              >
                <FilterIcon />
                Filtrele
              </SecondaryButton>
              
              <PrimaryButton as={Link} to="/randevu/ekle">
                <PlusIcon />
                Yeni Randevu Ekle
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
          ) : appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ marginBottom: '16px', color: '#6b7280' }}>Henüz kaydedilmiş randevu bulunmamaktadır.</p>
              <PrimaryButton as={Link} to="/randevu/ekle">
                <PlusIcon style={{ marginRight: '8px' }} /> 
                İlk Randevuyu Oluştur
              </PrimaryButton>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={appointments}
              pagination
              customStyles={dataTableCustomStyles}
              highlightOnHover
              pointerOnHover
              persistTableHead
              paginationPerPage={perPage}
              paginationTotalRows={totalRows}
              paginationDefaultPage={currentPage}
              onChangePage={page => setCurrentPage(page)}
              onChangeRowsPerPage={newPerPage => setPerPage(newPerPage)}
              paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
            />
          )}
        </StyledCardBody>
      </StyledCard>
      
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Randevu Sil"
        message="Bu randevuyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </>
  );
};

export default AppointmentList; 