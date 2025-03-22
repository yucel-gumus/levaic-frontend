import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { getBlogs, deleteBlog } from '../../services/blogApi';
import { formatISODateToLocalDate, formatApiError } from '../../services/utils';
import { 
  PlusIcon, 
  SearchIcon, 
  EditIcon, 
  TrashIcon,
  ArrowRightIcon
} from '../../components/icons';
import {
  StyledCard,
  StyledCardHeader,
  StyledCardBody,
  SearchIconWrapper,
  ActionButton,
  PrimaryButton,
  EditButton,
  ButtonGroup,
  ActionHeader,
  dataTableCustomStyles,
  FilterInput
} from '../../components/common/common.styles';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // Blog listesini yükle
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBlogs();
      
      // API'den gelen verileri formatlama
      // Yanıtı kontrol et ve doğru veri yapısını al
      const blogsData = response.data && Array.isArray(response.data) 
        ? response.data 
        : (response.data && Array.isArray(response.data.data) 
            ? response.data.data 
            : []);
      
      const formattedBlogs = blogsData.map(blog => ({
        ...blog,
        consultantName: blog.consultant ? `${blog.consultant.ad} ${blog.consultant.soyad}` : 'Belirtilmemiş',
        createdAt: formatISODateToLocalDate(blog.createdAt),
        blockCount: blog.blocks?.length || 0
      }));
      
      setBlogs(formattedBlogs);
    } catch (err) {
      setError('Bloglar yüklenirken bir hata oluştu: ' + err.message);
      console.error('Blog API hatası:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Blog silme işlemi
  const handleDeleteBlog = useCallback(async (id) => {
    if (!window.confirm('Bu blogu silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteBlog(id);
      await fetchBlogs();
      alert('Blog başarıyla silindi.');
    } catch (err) {
      setError('Blog silinirken bir hata oluştu: ' + err.message);
      alert(`Hata: ${formatApiError(err)}`);
    } finally {
      setLoading(false);
    }
  }, [fetchBlogs]);

  // Arama ile filtreleme
  const filteredItems = blogs.filter(
    blog => blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           blog.consultantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tablo sütunlarını tanımla
  const columns = [
    {
      name: 'Başlık',
      selector: row => row.title,
      sortable: true,
      grow: 2
    },
    {
      name: 'Danışman',
      selector: row => row.consultantName,
      sortable: true,
      grow: 1
    },
    {
      name: 'Blok Sayısı',
      selector: row => row.blockCount,
      sortable: true,
      center: true
    },
    {
      name: 'Oluşturulma Tarihi',
      selector: row => row.createdAt,
      sortable: true
    },
    {
      name: 'İşlemler',
      cell: (row) => (
        <ButtonGroup>
          <PrimaryButton as={Link} to={`/blog/${row._id}`} title="Görüntüle">
            <ArrowRightIcon size={18} />
          </PrimaryButton>
          <EditButton as={Link} to={`/blog/duzenle/${row._id}`} title="Düzenle">
            <EditIcon size={18} />
          </EditButton>
          <ActionButton danger onClick={() => handleDeleteBlog(row._id)} title="Sil">
            <TrashIcon size={18} />
          </ActionButton>
        </ButtonGroup>
      ),
      button: true,
      right: true
    }
  ];

  // Veri tablosu bileşeni
  const renderDataTable = () => {
    return (
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        persistTableHead
        progressPending={loading}
        noDataComponent="Blog bulunamadı"
        customStyles={dataTableCustomStyles}
      />
    );
  };

  return (
    <StyledCard>
      <StyledCardHeader>
        <h1>Bloglar</h1>
        <ActionHeader>
          <SearchIconWrapper>
            <SearchIcon />
            <FilterInput
              type="text"
              placeholder="Blog ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              hasIcon={true}
            />
          </SearchIconWrapper>
          <PrimaryButton as={Link} to="/blog/ekle">
            <PlusIcon size={20} />
            Yeni Blog
          </PrimaryButton>
        </ActionHeader>
      </StyledCardHeader>
      <StyledCardBody>
        {error && <div className="alert alert-danger">{error}</div>}
        {renderDataTable()}
      </StyledCardBody>
    </StyledCard>
  );
};

export default BlogList; 