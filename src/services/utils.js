/**
 * API yanıtlarında hata işleme için yardımcı fonksiyonlar
 */

/**
 * API hatasından anlamlı bir hata mesajı oluşturur
 * @param {Error} error - API isteğinden gelen hata
 * @returns {string} Kullanıcıya gösterilecek hata mesajı
 */
export const formatApiError = (error) => {
  let errorMessage = 'Beklenmeyen bir hata oluştu.';
  
  if (error.response) {
    if (error.response.data) {
      const errorData = error.response.data;
      
      // Belirli hata türlerini kontrol et
      if (errorData.error && errorData.error.message) {
        errorMessage = `Hata: ${errorData.error.message}`;
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
        errorMessage = `Validasyon hatası: ${errorData.errors.join(', ')}`;
      } else if (errorData.message) {
        errorMessage = `Sunucu hatası: ${errorData.message}`;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    }
    
    if (error.response.status === 400) {
      errorMessage = `Geçersiz veri: ${errorMessage}`;
    } else if (error.response.status === 404) {
      errorMessage = `Bulunamadı: ${errorMessage}`;
    } else if (error.response.status === 500) {
      errorMessage = `Sunucu hatası: ${errorMessage}`;
    }
  } else if (error.request) {
    // İstek yapıldı ama yanıt alınamadı
    errorMessage = 'Sunucuyla bağlantı kurulamadı. Lütfen internet bağlantınızı kontrol edin.';
  } else {
    // İstek oluşturulurken hata oluştu
    errorMessage = `İstek hatası: ${error.message}`;
  }
  
  return errorMessage;
};

/**
 * ISO formatındaki tarihi GG.AA.YYYY formatına dönüştürür
 * @param {string} isoDate - ISO formatında tarih
 * @returns {string} GG.AA.YYYY formatında tarih
 */
export const formatISODateToLocalDate = (isoDate) => {
  if (!isoDate) return '';
  
  if (isoDate.includes('T')) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  
  return isoDate;
}; 