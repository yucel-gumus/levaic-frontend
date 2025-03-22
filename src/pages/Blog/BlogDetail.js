import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getBlog, deleteBlog } from '../../services/blogApi';
import { formatISODateToLocalDate } from '../../services/utils';
import { 
  StyledCard, 
  StyledCardHeader, 
  StyledCardBody,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  DangerButton
} from '../../components/common/common.styles';
import { EditIcon, TrashIcon, ArrowLeftIcon } from '../../components/icons';
import { api } from '../../services/api';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBlog(id);
        setBlog(response.data);
      } catch (err) {
        setError('Blog yüklenirken bir hata oluştu: ' + err.message);
        toast.error('Blog yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Bu blogu silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteBlog(id);
      toast.success('Blog başarıyla silindi');
      navigate('/blog');
    } catch (err) {
      setError('Blog silinirken bir hata oluştu: ' + err.message);
      toast.error('Blog silinirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Blog bloklarını render et
  const renderBlock = (block, index) => {
    switch (block.type) {
      case 'text':
        return (
          <div key={index} className="blog-text mb-4">
            <p>{block.content}</p>
          </div>
        );
      case 'image':
        // Görüntü URL'sini güvenli şekilde oluştur
        let imageUrl;
        try {
          // Daha detaylı log ekleyelim
          console.log('Görüntü içeriği:', {
            type: typeof block.content,
            isString: typeof block.content === 'string',
            isBase64: typeof block.content === 'string' && block.content.includes('base64'),
            isHttp: typeof block.content === 'string' && block.content.startsWith('http'),
            hasImageUrl: typeof block.imageUrl === 'string',
            content: typeof block.content === 'string' 
              ? (block.content.length > 50 
                  ? block.content.substring(0, 50) + '...' 
                  : block.content)
              : null,
            apiUrl: api.defaults.baseURL
          });
          
          // Base64 görüntüsü mü?
          if (typeof block.content === 'string' && block.content.includes('base64')) {
            imageUrl = block.content;
          } 
          // imageUrl özelliği varsa (S3 imzalı URL)
          else if (block.imageUrl && typeof block.imageUrl === 'string') {
            imageUrl = block.imageUrl;
            console.log('S3 Signed URL kullanılıyor:', imageUrl);
          }
          // Tam URL mi?
          else if (typeof block.content === 'string' && block.content.startsWith('http')) {
            imageUrl = block.content;
          } 
          // Bilinmeyen format
          else {
            console.error('Bilinmeyen görüntü formatı:', typeof block.content);
            imageUrl = 'https://via.placeholder.com/400?text=Geçersiz+Görüntü';
          }
        } catch (error) {
          console.error('Görüntü URL oluşturma hatası:', error);
          imageUrl = 'https://via.placeholder.com/400?text=Görüntü+Hatası';
        }
        
        return (
          <div key={index} className="blog-image mb-4 text-center">
            <img 
              src={imageUrl}
              alt={`Blog görseli ${index + 1}`} 
              className="img-fluid" 
              style={{ maxHeight: '400px' }}
              loading="lazy"
              onLoad={(e) => console.log('Resim yüklendi:', imageUrl)}
              onError={(e) => {
                console.error('Resim yüklenirken hata:', e);
                console.error('Yüklenemeyen resim URL:', imageUrl);
                e.target.src = 'https://via.placeholder.com/400?text=Resim+Yüklenemedi';
                e.target.onerror = null; // Sonsuz döngüyü engelle
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <StyledCard>
        <StyledCardBody>
          <p>Yükleniyor...</p>
        </StyledCardBody>
      </StyledCard>
    );
  }

  if (error) {
    return (
      <StyledCard>
        <StyledCardBody>
          <div className="alert alert-danger">{error}</div>
          <Link to="/blog" className="btn btn-secondary">
            <ArrowLeftIcon size={16} />
            Bloglar Listesine Dön
          </Link>
        </StyledCardBody>
      </StyledCard>
    );
  }

  if (!blog) {
    return (
      <StyledCard>
        <StyledCardBody>
          <p>Blog bulunamadı.</p>
          <Link to="/blog" className="btn btn-secondary">
            <ArrowLeftIcon size={16} />
            Bloglar Listesine Dön
          </Link>
        </StyledCardBody>
      </StyledCard>
    );
  }

  // Blokları sıralama numarasına göre sırala
  const sortedBlocks = blog.blocks.sort((a, b) => a.order - b.order);

  return (
    <StyledCard>
      <StyledCardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <h1>{blog.title}</h1>
          <ButtonGroup>
            <PrimaryButton as={Link} to={`/blog/duzenle/${blog._id}`}>
              <EditIcon size={18} />
              Düzenle
            </PrimaryButton>
            <DangerButton onClick={handleDelete}>
              <TrashIcon size={18} />
              Sil
            </DangerButton>
            <SecondaryButton as={Link} to="/blog">
              <ArrowLeftIcon size={18} />
              Geri Dön
            </SecondaryButton>
          </ButtonGroup>
        </div>
        <div className="blog-meta mt-2">
          <small>
            <strong>Yazar:</strong> {blog.consultant?.ad} {blog.consultant?.soyad} | 
            <strong> Oluşturulma Tarihi:</strong> {formatISODateToLocalDate(blog.createdAt)}
          </small>
        </div>
      </StyledCardHeader>
      <StyledCardBody>
        <div className="blog-content">
          {sortedBlocks.map((block, index) => renderBlock(block, index))}
        </div>
      </StyledCardBody>
    </StyledCard>
  );
};

export default BlogDetail; 