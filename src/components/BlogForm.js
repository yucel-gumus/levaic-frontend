import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createBlog, updateBlog, getBlog } from '../services/blogApi';
import { getConsultants } from '../services/consultantApi';
import { api } from '../services/api';
import { 
  StyledCard, 
  StyledCardHeader, 
  StyledCardBody,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormRow,
  PrimaryButton,
  SecondaryButton,
  ButtonGroup,
  ErrorText,
  ActionButton
} from './common/common.styles';
import { PlusIcon, TrashIcon, ImageIcon, TextIcon } from './icons';

const initialFormData = {
  title: '',
  consultant: '',
  blocks: []
};

const BlogForm = ({ id }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Danışman listesini yükle
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await getConsultants();
        setConsultants(response.data);
      } catch (error) {
        toast.error('Danışmanlar yüklenirken bir hata oluştu');
      }
    };
    
    fetchConsultants();
  }, []);

  // Düzenleme modunda ise mevcut blog verisini getir
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getBlog(id);
        const blogData = response.data;
        
        // Blogdaki blokları işle ve sırala
        let processedBlocks = blogData.blocks;
        
        // imageUrl'leri block nesnelerine taşı
        if (processedBlocks && Array.isArray(processedBlocks)) {
          processedBlocks = processedBlocks.map(block => {
            if (block.type === 'image' && block.imageUrl) {
              return {
                ...block,
                imageUrl: block.imageUrl
              };
            }
            return block;
          });
        }
        
        setFormData({
          title: blogData.title,
          consultant: blogData.consultant._id,
          blocks: processedBlocks.sort((a, b) => a.order - b.order)
        });
        
        console.log('Blog verisi yüklendi:', {
          title: blogData.title,
          blocks: processedBlocks.map(b => ({
            type: b.type,
            hasImageUrl: !!b.imageUrl,
            content: b.content?.substring(0, 30) + '...'
          }))
        });
      } catch (error) {
        console.error('Blog yükleme hatası:', error);
        toast.error('Blog bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogData();
  }, [id]);

  // Form alanlarındaki değişiklikleri işle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Blok içeriğindeki değişiklikleri işle
  const handleBlockChange = (index, field, value) => {
    const updatedBlocks = [...formData.blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      blocks: updatedBlocks
    }));
  };

  // Resim yükleme işlemi
  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya tipini kontrol et
    if (!file.type.match('image.*')) {
      toast.error('Lütfen geçerli bir resim dosyası seçin');
      return;
    }
    
    // Dosya boyutu kontrolü (10MB maksimum)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Dosya boyutu 10MB\'dan büyük olamaz');
      return;
    }

    try {
      // Base64'e dönüştür
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          // Base64 formatı kontrolü
          if (typeof reader.result !== 'string' || !reader.result.includes('base64')) {
            throw new Error('Geçersiz resim formatı');
          }
          
          handleBlockChange(index, 'content', reader.result);
          console.log('Resim yüklendi, boyut:', Math.round(reader.result.length / 1024), 'KB');
        } catch (err) {
          console.error('Resim formatı hatası:', err);
          toast.error('Resim formatı geçersiz');
        }
      };
      
      reader.onerror = () => {
        console.error('FileReader hatası');
        toast.error('Resim okunamadı');
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      toast.error('Resim yüklenirken bir hata oluştu');
    }
  };

  // Yeni blok ekle
  const addBlock = (type) => {
    const newBlock = {
      type,
      content: type === 'text' ? '' : '',
      order: formData.blocks.length
    };
    
    setFormData(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  // Blok sil
  const removeBlock = (index) => {
    const updatedBlocks = formData.blocks.filter((_, i) => i !== index);
    // Order değerlerini güncelle
    const reorderedBlocks = updatedBlocks.map((block, i) => ({
      ...block,
      order: i
    }));
    
    setFormData(prev => ({
      ...prev,
      blocks: reorderedBlocks
    }));
  };

  // Form doğrulama
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Blog başlığı gereklidir';
    }
    
    if (!formData.consultant) {
      newErrors.consultant = 'Lütfen bir danışman seçin';
    }
    
    if (formData.blocks.length === 0) {
      newErrors.blocks = 'En az bir blok eklemelisiniz';
    } else {
      formData.blocks.forEach((block, index) => {
        if (!block.content) {
          newErrors[`block_${index}`] = `Blok ${index + 1} içeriği boş olamaz`;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Formda image URL'leri temizleyelim, bunlar sadece görüntülemek için kullanılıyor
      const formDataCopy = {
        ...formData,
        blocks: formData.blocks.map(block => {
          const { imageUrl, ...rest } = block;
          return rest;
        })
      };
      
      if (id) {
        // Mevcut blogu güncelle
        await updateBlog(id, formDataCopy);
        toast.success('Blog başarıyla güncellendi');
      } else {
        // Yeni blog oluştur
        await createBlog(formDataCopy);
        toast.success('Blog başarıyla oluşturuldu');
      }
      navigate('/blog');
    } catch (error) {
      console.error('Blog kaydetme hatası:', error);
      toast.error(`Blog ${id ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Blok içeriği render
  const renderBlockContent = (block, index) => {
    switch (block.type) {
      case 'text':
        return (
          <FormTextarea
            value={block.content}
            onChange={(e) => handleBlockChange(index, 'content', e.target.value)}
            placeholder="Metin içeriği..."
            rows={4}
          />
        );
      case 'image':
        return (
          <div className="image-block">
            {/* Eğer resim zaten yüklenmişse (S3 key veya URL ise) önizleme göster */}
            {block.content && !block.content.includes('base64') ? (
              <div className="image-preview mb-3">
                <p className="text-success mb-2">
                  <small>Resim yüklendi. Değiştirmek isterseniz yeni resim seçebilirsiniz.</small>
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      // Resmi değiştirmek için content'i temizle, böylece input görünür olacak
                      handleBlockChange(index, 'content', '');
                    }}
                  >
                    Resmi Değiştir
                  </button>
                </div>
                <img 
                  src={block.imageUrl || block.content.startsWith('http') 
                    ? block.imageUrl || block.content 
                    : `${api.defaults.baseURL}${block.content}`}
                  alt="Yüklenen resim" 
                  style={{ maxWidth: '100%', maxHeight: '200px' }} 
                  onError={(e) => {
                    console.error('Resim yüklenirken hata:', e);
                    console.error('Yüklenemeyen resim URL:', block.imageUrl || (block.content.startsWith('http') 
                      ? block.content 
                      : `${api.defaults.baseURL}${block.content}`));
                    e.target.src = 'https://via.placeholder.com/400?text=Resim+Yüklenemedi';
                    e.target.onerror = null; // Sonsuz döngüyü engelle
                  }}
                />
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e)}
                style={{ marginBottom: '10px' }}
              />
            )}
            
            {/* Base64 ise önizleme göster */}
            {block.content && block.content.includes('base64') && (
              <div className="image-preview">
                <img 
                  src={block.content} 
                  alt="Önizleme" 
                  style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} 
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <StyledCard>
      <StyledCardHeader>
        <h1>{id ? 'Blog Düzenle' : 'Yeni Blog Ekle'}</h1>
      </StyledCardHeader>
      <StyledCardBody>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="consultant">Danışman Seçin *</FormLabel>
                <FormSelect
                  id="consultant"
                  name="consultant"
                  value={formData.consultant}
                  onChange={handleChange}
                  isInvalid={!!errors.consultant}
                >
                  <option value="">Danışman Seçin</option>
                  {consultants.map(consultant => (
                    <option key={consultant._id} value={consultant._id}>
                      {consultant.ad} {consultant.soyad} ({consultant.uzmanlik})
                    </option>
                  ))}
                </FormSelect>
                {errors.consultant && <ErrorText>{errors.consultant}</ErrorText>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="title">Blog Başlığı *</FormLabel>
                <FormInput
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Blog başlığını girin"
                  isInvalid={!!errors.title}
                />
                {errors.title && <ErrorText>{errors.title}</ErrorText>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <FormLabel>Blog İçeriği *</FormLabel>
                <div className="mb-3">
                  <small>
                    Aşağıdaki butonları kullanarak metinler ve görseller ekleyebilirsiniz.
                    Her bir blok ayrı ayrı eklenebilir ve düzenlenebilir.
                  </small>
                </div>
                
                {errors.blocks && <ErrorText>{errors.blocks}</ErrorText>}
                
                <div className="mb-3">
                  <ButtonGroup>
                    <PrimaryButton 
                      type="button" 
                      onClick={() => addBlock('text')}
                      small
                    >
                      <TextIcon size={16} />
                      Metin Ekle
                    </PrimaryButton>
                    <PrimaryButton 
                      type="button" 
                      onClick={() => addBlock('image')}
                      small
                    >
                      <ImageIcon size={16} />
                      Resim Ekle
                    </PrimaryButton>
                  </ButtonGroup>
                </div>
                
                {formData.blocks.map((block, index) => (
                  <div 
                    key={index}
                    className="blog-block p-3 mb-3"
                    style={{ 
                      border: '1px solid #ccc', 
                      borderRadius: '4px',
                      position: 'relative',
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">
                        {block.type === 'text' ? 'Metin Bloğu' : 'Resim Bloğu'} #{index + 1}
                      </h5>
                      <ActionButton
                        type="button"
                        danger
                        onClick={() => removeBlock(index)}
                        title="Bloğu Sil"
                      >
                        <TrashIcon size={16} />
                      </ActionButton>
                    </div>
                    
                    {renderBlockContent(block, index)}
                    
                    {errors[`block_${index}`] && (
                      <ErrorText>{errors[`block_${index}`]}</ErrorText>
                    )}
                  </div>
                ))}
              </FormGroup>
            </FormRow>

            <ButtonGroup>
              <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Kaydediliyor...' : (id ? 'Güncelle' : 'Oluştur')}
              </PrimaryButton>
              <SecondaryButton as={Link} to="/blog">
                İptal
              </SecondaryButton>
            </ButtonGroup>
          </form>
        )}
      </StyledCardBody>
    </StyledCard>
  );
};

export default BlogForm; 