import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Sayfa başlığı bileşeni
 * @param {Object} props - Bileşen özellikleri
 * @param {string} props.title - Sayfa başlığı
 * @param {Object} props.action - Başlık yanında yer alacak aksiyon düğmesi
 * @param {Function} props.action.onClick - Düğme tıklama fonksiyonu
 * @param {string} props.action.text - Düğme metni
 * @param {string} props.action.icon - Düğme ikonu
 * @param {string} props.action.to - Link hedefi (onClick yerine kullanılır)
 * @returns {JSX.Element}
 */
const PageHeader = ({ 
  title, 
  action = null,
  className = '' 
}) => {
  return (
    <div className={`clinic-header ${className}`}>
      <h1>{title}</h1>
      
      {action && (
        action.to ? (
          <Link to={action.to} className="btn btn-primary">
            {action.icon && <i className={`fas fa-${action.icon}`}></i>}
            {action.icon && ' '}
            {action.text}
          </Link>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={action.onClick}
          >
            {action.icon && <i className={`fas fa-${action.icon}`}></i>}
            {action.icon && ' '}
            {action.text}
          </button>
        )
      )}
    </div>
  );
};

export default PageHeader; 