/**
 * Belirli bir süre içinde tekrarlanan işlevleri limit altında tutmak için debounce
 * @param {Function} func - Çalıştırılacak fonksiyon
 * @param {number} wait - Bekleme süresi (ms)
 * @returns {Function} - Debounce edilmiş fonksiyon
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Sayfa yüklemeleri için lazy loading
 * @param {Function} importFunc - Dynamic import fonksiyonu
 * @returns {Object} - Next.js lazy loaded component
 */
export const lazyImport = (importFunc) => {
  return {
    ssr: false,
    loading: () => <div className="animate-pulse h-32 bg-gray-800/50 rounded-lg"></div>,
    ...importFunc
  };
};

/**
 * API isteklerinde hataları standartlaştırma
 * @param {Error} error - Hata nesnesi
 * @returns {Object} - Standartlaştırılmış hata mesajı
 */
export const formatError = (error) => {
  return {
    message: error?.response?.data?.message || error?.message || 'Bir hata oluştu',
    status: error?.response?.status || 500
  };
};

/**
 * Tweet metni için karakter limiti kontrolü
 * @param {string} text - Tweet metni
 * @param {number} limit - Karakter limiti
 * @returns {Object} - Limit bilgisi 
 */
export const checkTweetLimit = (text = '', limit = 280) => {
  const count = text.length;
  const remaining = limit - count;
  
  return {
    count,
    remaining,
    isExceeded: remaining < 0,
    percentage: (count / limit) * 100
  };
}; 