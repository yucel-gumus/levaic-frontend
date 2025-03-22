import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import { toast } from 'react-hot-toast';
import { appointmentService } from '../../services/appointmentApi';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import ConfirmModal from '../../components/ConfirmModal';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, [refreshData]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getAll();
      if (response && response.data) {
        setAppointments(response.data);
      } else {
        setAppointments([]);
      }
      setError(null);
    } catch (err) {
      setError('Randevular yüklenirken bir hata oluştu');
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
      toast.error('Randevu silinirken bir hata oluştu');
    }
  };

  const confirmDelete = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
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

  const getStatusBadgeType = (status) => {
    switch (status) {
      case 'Beklemede': return 'warning';
      case 'Onaylandı': return 'success';
      case 'İptal Edildi': return 'danger';
      case 'Tamamlandı': return 'info';
      default: return 'secondary';
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
        <StatusBadge type={getStatusBadgeType(row.durum)}>
          {row.durum}
        </StatusBadge>
      ),
    },
    {
      name: 'İşlemler',
      cell: row => (
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/randevu/duzenle/${row._id}`)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => confirmDelete(row)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f8f9fa',
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: '#dfe3e8',
      },
    },
    headCells: {
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: '#f5f6f8',
        borderBottomColor: '#EDEDED',
        outline: '1px solid #EDEDED',
      },
    },
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Randevular</h5>
              <Button
                as={Link}
                to="/randevu/ekle"
                variant="success"
                className="d-flex align-items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Yeni Randevu Ekle
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {loading && <Loader />}
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {!loading && !error && appointments.length === 0 && (
                <div className="alert alert-info" role="alert">
                  Henüz kaydedilmiş randevu bulunmamaktadır. Yeni randevu eklemek için yukarıdaki butonu kullanabilirsiniz.
                </div>
              )}
              
              {!loading && !error && appointments.length > 0 && (
                <DataTable
                  columns={columns}
                  data={appointments}
                  pagination
                  responsive
                  highlightOnHover
                  pointerOnHover
                  customStyles={customStyles}
                  noDataComponent="Randevu bulunamadı"
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Randevu Sil"
        message="Bu randevuyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </Container>
  );
};

export default AppointmentList; 