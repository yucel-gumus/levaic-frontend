import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import styled from 'styled-components';
import { Card, Button, Table, Spinner, Badge } from 'react-bootstrap';
import { 
  FilterIcon, 
  SearchIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon 
} from './icons';

import { getAppointments, deleteAppointment } from '../services/appointmentApi';
import { getClinics } from '../services/clinicApi';
import { getConsultants } from '../services/consultantApi';
import { RANDEVU_DURUMLARI } from '../constants';

// Styled Components
const StyledCard = styled(Card)`
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const StyledCardHeader = styled(Card.Header)`
  background-color: #fff;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledCardBody = styled(Card.Body)`
  padding: 1.5rem;
`;

const StatusBadge = styled(Badge)`
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
`;

const FilterPanel = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h5`
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterColumn = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1rem;
`;

const FilterButton = styled(Button)`
  min-width: 120px;
`;

const DataTable = styled(Table)`
  & th {
    background-color: #f8f9fa;
    color: #495057;
    font-weight: 600;
  }
  
  & tbody tr {
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #f8f9fa;
    }
  }
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionIcon = styled.span`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    klinik: '',
    danismanlar: []
  });
  
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, clinicsData, consultantsData] = await Promise.all([
        getAppointments(),
        getClinics(),
        getConsultants()
      ]);
      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
      setClinics(clinicsData);
      setConsultants(consultantsData);
      setError(null);
      toast.success('Randevular başarıyla yüklendi');
    } catch (err) {
      toast.error('Randevular yüklenirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
      try {
        await deleteAppointment(id);
        setAppointments(appointments.filter(appointment => appointment._id !== id));
        setFilteredAppointments(filteredAppointments.filter(appointment => appointment._id !== id));
        toast.success('Randevu başarıyla silindi');
      } catch (err) {
        toast.error('Randevu silinirken bir hata oluştu: ' + err.message);
      }
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };
  
  const handleConsultantChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFilters(prev => ({
      ...prev,
      danismanlar: selectedOptions
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      klinik: '',
      danismanlar: []
    });
    setActiveFilters({});
    setFilteredAppointments(appointments);
  };
  
  const applyFilters = () => {
    const activeFiltersCopy = {};
    
    // Only add non-empty filters to activeFilters
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      
      if (Array.isArray(value) && value.length > 0) {
        activeFiltersCopy[key] = [...value];
      } else if (value && !Array.isArray(value)) {
        activeFiltersCopy[key] = value;
      }
    });
    
    setActiveFilters(activeFiltersCopy);
    
    // Filter appointments based on active filters
    const filtered = appointments.filter(appointment => {
      let include = true;
      
      if (activeFiltersCopy.klinik && appointment.klinik._id !== activeFiltersCopy.klinik) {
        include = false;
      }
      
      if (activeFiltersCopy.danismanlar && activeFiltersCopy.danismanlar.length > 0) {
        // Check if any of the appointment's consultants are in the selected consultants
        const consultantMatch = appointment.danismanlar.some(consultant => 
          activeFiltersCopy.danismanlar.includes(consultant._id)
        );
        if (!consultantMatch) {
          include = false;
        }
      }
      
      return include;
    });
    
    setFilteredAppointments(filtered);
  };
  
  const hasActiveFilters = () => {
    return Object.keys(activeFilters).length > 0;
  };
  
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Beklemede':
        return 'warning';
      case 'Onaylandı':
        return 'success';
      case 'İptal Edildi':
        return 'danger';
      case 'Tamamlandı':
        return 'info';
      default:
        return 'secondary';
    }
  };
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };
  
  return (
    <div className="container py-4">
      <StyledCard>
        <StyledCardHeader>
          <h2 className="mb-0">Randevular</h2>
          <Link to="/randevu/ekle" className="btn btn-primary">
            <PlusIcon size={16} className="me-2" /> Yeni Randevu
          </Link>
        </StyledCardHeader>
        
        <StyledCardBody>
          <FilterPanel>
            <FilterTitle>
              <FilterIcon size={20} className="me-2" /> Filtreleme
            </FilterTitle>
            
            <FilterRow>
              <FilterColumn>
                <FilterLabel>Klinik</FilterLabel>
                <FilterSelect 
                  name="klinik"
                  value={filters.klinik}
                  onChange={handleFilterChange}
                >
                  <option value="">Tüm Klinikler</option>
                  {clinics.map(clinic => (
                    <option key={clinic._id} value={clinic._id}>
                      {clinic.ad}
                    </option>
                  ))}
                </FilterSelect>
              </FilterColumn>
              
              <FilterColumn>
                <FilterLabel>Danışmanlar</FilterLabel>
                <FilterSelect 
                  name="danismanlar"
                  multiple
                  value={filters.danismanlar}
                  onChange={handleConsultantChange}
                  style={{ height: '100px' }}
                >
                  {consultants.map(consultant => (
                    <option key={consultant._id} value={consultant._id}>
                      {`${consultant.ad} ${consultant.soyad}`}
                    </option>
                  ))}
                </FilterSelect>
              </FilterColumn>
            </FilterRow>
            
            <FilterActions>
              <FilterButton variant="outline-secondary" onClick={clearFilters}>
                Temizle
              </FilterButton>
              <FilterButton variant="primary" onClick={applyFilters}>
                Filtrele
              </FilterButton>
            </FilterActions>
          </FilterPanel>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="alert alert-info">
              {hasActiveFilters() 
                ? 'Filtrelere uygun randevu bulunamadı. Lütfen filtreleri değiştirin veya temizleyin.'
                : 'Henüz randevu bulunmuyor. "Yeni Randevu" butonu ile randevu ekleyebilirsiniz.'}
            </div>
          ) : (
            <DataTable responsive hover>
              <thead>
                <tr>
                  <th>Klinik</th>
                  <th>Danışmanlar</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(appointment => (
                  <tr key={appointment._id}>
                    <td>{appointment.klinik ? appointment.klinik.ad : 'Belirtilmemiş'}</td>
                    <td>
                      {appointment.danismanlar && appointment.danismanlar.length > 0
                        ? appointment.danismanlar.map(d => `${d.ad} ${d.soyad}`).join(', ')
                        : 'Belirtilmemiş'}
                    </td>
                    <td>{formatDate(appointment.tarih)}</td>
                    <td>
                      <StatusBadge bg={getStatusBadgeVariant(appointment.durum)}>
                        {appointment.durum}
                      </StatusBadge>
                    </td>
                    <td>
                      <ActionsCell>
                        <Link to={`/randevu/duzenle/${appointment._id}`}>
                          <ActionIcon>
                            <EditIcon size={16} color="#495057" />
                          </ActionIcon>
                        </Link>
                        <ActionIcon onClick={() => handleDelete(appointment._id)}>
                          <TrashIcon size={16} color="#dc3545" />
                        </ActionIcon>
                      </ActionsCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </StyledCardBody>
      </StyledCard>
    </div>
  );
};

export default Appointments; 