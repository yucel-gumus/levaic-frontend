import { toast } from 'react-hot-toast';
import { createBaseService } from './api';

// Blog servisi oluştur
const blogService = createBaseService('blogs');

// Veri yanıt formatını işler
const processApiResponse = (response) => {
  try {
    // API yanıtı yapısını kontrol et
    console.log('API yanıt yapısı:', {
      hasData: !!response?.data,
      hasNestedData: !!response?.data?.data,
      responseStatus: response?.status
    });
    
    // API yanıtı data.data formatındaysa data altındaki verileri döndür
    if (response && response.data && response.data.data) {
      return {
        ...response,
        data: response.data.data
      };
    }
    
    // Diğer durumlarda orijinal yanıtı döndür
    return response;
  } catch (error) {
    console.error('processApiResponse hatası:', error);
    return response; // Hata durumunda orijinal yanıtı döndür
  }
};

// Tüm blogları getir
const getBlogs = async () => {
  try {
    const response = await blogService.getAll();
    return processApiResponse(response);
  } catch (error) {
    toast.error('Bloglar yüklenirken bir hata oluştu');
    console.error('Blog API hatası:', error);
    throw error;
  }
};

// Blog detayını getir
const getBlog = async (id) => {
  try {
    const response = await blogService.getById(id);
    return processApiResponse(response);
  } catch (error) {
    toast.error('Blog bilgileri alınamadı');
    console.error('Blog detay hatası:', error);
    throw error;
  }
};

// Yeni blog oluştur
const createBlog = async (blogData) => {
  try {
    const response = await blogService.create(blogData);
    toast.success('Blog başarıyla oluşturuldu');
    return processApiResponse(response);
  } catch (error) {
    toast.error('Blog oluşturulurken bir hata oluştu');
    console.error('Blog oluşturma hatası:', error);
    throw error;
  }
};

// Blog güncelle
const updateBlog = async (id, blogData) => {
  try {
    const response = await blogService.update(id, blogData);
    toast.success('Blog başarıyla güncellendi');
    return processApiResponse(response);
  } catch (error) {
    toast.error('Blog güncellenirken bir hata oluştu');
    console.error('Blog güncelleme hatası:', error);
    throw error;
  }
};

// Blog sil
const deleteBlog = async (id) => {
  try {
    const response = await blogService.delete(id);
    toast.success('Blog başarıyla silindi');
    return processApiResponse(response);
  } catch (error) {
    toast.error('Blog silinirken bir hata oluştu');
    console.error('Blog silme hatası:', error);
    throw error;
  }
};

export {
  blogService,
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
}; 