import { toast } from 'react-hot-toast';
import { createBaseService } from './api';

// Üye servisi oluştur
const memberService = createBaseService('members');

// Tüm üyeleri getir
const getMembers = async () => {
  try {
    const response = await memberService.getAll();
    return response;
  } catch (error) {
    toast.error('Üyeler yüklenirken bir hata oluştu');
    throw error;
  }
};

// Üye detaylarını getir
const getMember = async (id) => {
  try {
    const response = await memberService.getById(id);
    return response;
  } catch (error) {
    toast.error('Üye bilgileri alınamadı');
    throw error;
  }
};

// Yeni üye oluştur
const createMember = async (memberData) => {
  try {
    const response = await memberService.create(memberData);
    toast.success('Üye başarıyla oluşturuldu');
    return response;
  } catch (error) {
    toast.error('Üye oluşturulurken bir hata oluştu');
    throw error;
  }
};

// Üye güncelle
const updateMember = async (id, memberData) => {
  try {
    const response = await memberService.update(id, memberData);
    toast.success('Üye başarıyla güncellendi');
    return response;
  } catch (error) {
    toast.error('Üye güncellenirken bir hata oluştu');
    throw error;
  }
};

// Üye sil
const deleteMember = async (id) => {
  try {
    const response = await memberService.delete(id);
    toast.success('Üye başarıyla silindi');
    return response;
  } catch (error) {
    toast.error('Üye silinirken bir hata oluştu');
    throw error;
  }
};

export {
  memberService,
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember
}; 