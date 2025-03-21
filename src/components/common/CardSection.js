import React from 'react';

/**
 * Kart bileşeni
 * @param {Object} props - Bileşen özellikleri
 * @param {string} props.title - Kart başlığı
 * @param {React.ReactNode} props.children - Kart içeriği
 * @param {string} props.className - Ek CSS sınıfı
 * @param {string} props.headerClassName - Başlık için ek CSS sınıfı
 * @param {string} props.icon - Başlık için ikon sınıfı
 * @returns {JSX.Element}
 */
const CardSection = ({ 
  title, 
  children, 
  className = '', 
  headerClassName = 'bg-primary',
  icon = 'fas fa-info-circle',
  ...props 
}) => {
  return (
    <div className={`card mb-4 ${className}`} {...props}>
      <div className={`card-header ${headerClassName} text-white`}>
        <h3 className="mb-0">
          <i className={`${icon} me-2`}></i>
          {title}
        </h3>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default CardSection; 