import React from 'react';

/**
 * Form alanı bileşeni
 * @param {Object} props - Bileşen özellikleri
 * @param {string} props.label - Alan etiketi
 * @param {string} props.name - Alan adı
 * @param {string} props.type - Alan türü (text, email, select, textarea)
 * @param {string} props.value - Alan değeri
 * @param {Function} props.onChange - Değişiklik olay işleyicisi
 * @param {boolean} props.required - Zorunlu alan mı?
 * @param {string} props.placeholder - Placeholder metni
 * @param {Array} props.options - Select alanı için seçenekler
 * @param {string} props.className - Ek CSS sınıfı
 * @returns {JSX.Element}
 */
const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  placeholder = '',
  options = [],
  className = '',
  rows = 3,
  ...props 
}) => {
  // Ortak özellikleri hesapla
  const commonProps = {
    name,
    value: value || '',
    onChange,
    id: `field-${name}`,
    required,
    className: `form-${type === 'select' || type === 'textarea' ? type : 'control'} ${className}`,
    placeholder,
    ...props
  };

  return (
    <div className="mb-3">
      <label htmlFor={`field-${name}`} className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      
      {type === 'select' ? (
        <select {...commonProps}>
          <option value="">{placeholder || 'Seçiniz'}</option>
          {options.map((option) => {
            // Eğer option bir obje ise (value, label)
            if (typeof option === 'object' && option.value !== undefined) {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            }
            // Eğer option bir string ise
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      ) : type === 'textarea' ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
};

export default FormField; 