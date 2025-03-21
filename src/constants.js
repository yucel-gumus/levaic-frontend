// Uzmanlık alanları seçenekleri
export const UZMANLIK_ALANLARI_OPTIONS = [
  { value: "Kln. Psk.", label: "Kln. Psk." },
  { value: "MCC Dr.", label: "MCC Dr." },
  { value: "PCC Uzm. Psk.", label: "PCC Uzm. Psk." },
  { value: "Uzm Psk.", label: "Uzm Psk." },
  { value: "Uzm. Antrenör", label: "Uzm. Antrenör" },
  { value: "Uzm. Psk. Aile Ve Çift Terapisti", label: "Uzm. Psk. Aile Ve Çift Terapisti" }
];

// Klinik durumları
export const KLINIK_DURUMLARI = [
  { value: "Aktif", label: "Aktif" },
  { value: "Pasif", label: "Pasif" },
  { value: "Askıda", label: "Askıda" }
];

// Cinsiyet seçenekleri
export const CINSIYET_OPTIONS = [
  { value: "Erkek", label: "Erkek" },
  { value: "Kadın", label: "Kadın" },
  { value: "Diğer", label: "Diğer" }
];

// Kan grubu seçenekleri
export const KAN_GRUBU_OPTIONS = [
  'A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', 'O Rh+', 'O Rh-'
];

// Regex Patterns
export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const DATE_REGEX = /^\d{2}\.\d{2}\.\d{4}$/;
export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

// Boş klinik nesnesi
export const EMPTY_CLINIC = {
  ad: '',
  e_posta: '',
  iletisim_numarasi: '',
  uzmanlik_alanlari: [],
  durum: 'Aktif',
  adres: '',
  sehir: '',
  ulke: '',
  posta_kodu: '',
  profil_resmi: null,
  yonetici_ad: '',
  yonetici_soyad: '',
  yonetici_e_posta: '',
  yonetici_iletisim_numarasi: '',
  yonetici_dogum_tarihi: '',
  yonetici_cinsiyet: 'Erkek',
  yonetici_profil_resmi: null
};

// EMPTY_MEMBER - Boş üye objesi
export const EMPTY_MEMBER = {
  ad: '',
  soyad: '',
  klinik: '',
  email: '',
  iletisim_numarasi: '',
  dogum_tarihi: '',
  kan_grubu: '',
  cinsiyet: '',
  adres: '',
  sehir: '',
  ulke: 'Türkiye', // Varsayılan değer
  posta_kodu: '',
  acil_durum_kisi: '',
  acil_durum_tel: '',
  durum: 'Aktif' // Varsayılan aktif
};

// EMPTY_CONSULTANT - Boş danışman objesi
export const EMPTY_CONSULTANT = {
  ad: '',
  soyad: '',
  klinik: '',
  email: '',
  iletisim_numarasi: '',
  dogum_tarihi: '',
  uzmanlik: '',
  tecrube_yili: '',
  cinsiyet: '',
  durum: 'Aktif', // Varsayılan aktif
  adres: '',
  sehir: '',
  posta_kodu: '',
  ulke: 'Türkiye', // Varsayılan değer
};

// Üye form validasyonu için yardımcı fonksiyon
export const validateMemberForm = (formData) => {
  const errors = [];
  
  // Ad ve Soyad kontrolü
  if (!formData.ad?.trim()) errors.push('Ad alanı boş olamaz');
  if (!formData.soyad?.trim()) errors.push('Soyad alanı boş olamaz');
  
  // Klinik ID kontrolü
  if (!formData.klinik) {
    errors.push('Klinik seçimi gereklidir');
  } else if (!OBJECT_ID_REGEX.test(formData.klinik)) {
    errors.push('Geçerli bir klinik seçiniz');
  }
  
  // Email kontrolü
  if (!formData.email?.trim()) {
    errors.push('E-posta adresi gereklidir');
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.push('Geçerli bir e-posta adresi giriniz');
  }
  
  // Tarih formatı kontrolü
  if (!formData.dogum_tarihi?.trim()) {
    errors.push('Doğum tarihi gereklidir');
  } else if (!DATE_REGEX.test(formData.dogum_tarihi)) {
    errors.push('Doğum tarihi GG.AA.YYYY formatında olmalıdır. Örnek: 01.01.2000');
  }
  
  // Diğer zorunlu alanlar
  if (!formData.iletisim_numarasi?.trim()) errors.push('İletişim numarası gereklidir');
  if (!formData.kan_grubu) errors.push('Kan grubu seçimi gereklidir');
  if (!formData.cinsiyet) errors.push('Cinsiyet seçimi gereklidir');
  if (!formData.adres?.trim()) errors.push('Adres alanı gereklidir');
  if (!formData.sehir?.trim()) errors.push('Şehir alanı gereklidir');
  if (!formData.ulke?.trim()) errors.push('Ülke alanı gereklidir');
  if (!formData.posta_kodu?.trim()) errors.push('Posta kodu gereklidir');
  if (!formData.acil_durum_kisi?.trim()) errors.push('Acil durumda ulaşılacak kişi bilgisi gereklidir');
  if (!formData.acil_durum_tel?.trim()) errors.push('Acil durumda ulaşılacak kişi telefon numarası gereklidir');
  
  return errors;
};

// Danışman form validasyonu için yardımcı fonksiyon
export const validateConsultantForm = (formData) => {
  const errors = [];
  
  // Ad ve Soyad kontrolü
  if (!formData.ad?.trim()) errors.push('Ad alanı boş olamaz');
  if (!formData.soyad?.trim()) errors.push('Soyad alanı boş olamaz');
  
  // Klinik ID kontrolü
  if (!formData.klinik) {
    errors.push('Klinik seçimi gereklidir');
  } else if (!OBJECT_ID_REGEX.test(formData.klinik)) {
    errors.push('Geçerli bir klinik seçiniz');
  }
  
  // Email kontrolü
  if (!formData.email?.trim()) {
    errors.push('E-posta adresi gereklidir');
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.push('Geçerli bir e-posta adresi giriniz');
  }
  
  // Tarih formatı kontrolü
  if (!formData.dogum_tarihi?.trim()) {
    errors.push('Doğum tarihi gereklidir');
  } else if (!DATE_REGEX.test(formData.dogum_tarihi)) {
    errors.push('Doğum tarihi GG.AA.YYYY formatında olmalıdır. Örnek: 01.01.2000');
  }
  
  // Tecrübe yılı kontrolü
  if (formData.tecrube_yili === '') {
    errors.push('Tecrübe yılı gereklidir');
  } else if (isNaN(formData.tecrube_yili) || parseInt(formData.tecrube_yili) < 0) {
    errors.push('Tecrübe yılı 0 veya daha büyük bir sayı olmalıdır');
  }
  
  // Diğer zorunlu alanlar
  if (!formData.iletisim_numarasi?.trim()) errors.push('İletişim numarası gereklidir');
  if (!formData.uzmanlik?.trim()) errors.push('Uzmanlık bilgisi gereklidir');
  if (!formData.cinsiyet) errors.push('Cinsiyet seçimi gereklidir');
  if (!formData.adres?.trim()) errors.push('Adres alanı gereklidir');
  if (!formData.sehir?.trim()) errors.push('Şehir alanı gereklidir');
  if (!formData.posta_kodu?.trim()) errors.push('Posta kodu gereklidir');
  if (!formData.ulke?.trim()) errors.push('Ülke alanı gereklidir');
  
  return errors;
};

export const HIZMET_KATEGORILERI = [
  { value: 'Aile ilişkilerim', label: 'Aile ilişkilerim' },
  { value: 'Eşleşme danışmanlığı', label: 'Eşleşme danışmanlığı' }
];

export const HIZMET_DURUMLARI = [
  { value: 'Aktif', label: 'Aktif' },
  { value: 'Pasif', label: 'Pasif' }
];

export const EVET_HAYIR_OPTIONS = [
  { value: true, label: 'Evet' },
  { value: false, label: 'Hayır' }
]; 