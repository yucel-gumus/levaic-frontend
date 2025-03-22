import React, { useState, useEffect } from 'react';

export const MultiSelect = ({ 
  options, 
  selectedValues, 
  onChange, 
  placeholder = "Seçiniz...", 
  noOptionsMessage = "Sonuç bulunamadı",
  allSelectedMessage = "Tümünü Seç" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.custom-multiselect')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Ensure selectedValues is always an array of primitive values (strings)
  const normalizeValue = (val) => {
    if (typeof val === 'object' && val !== null) {
      return val._id || String(val);
    }
    return val;
  };
  
  const normalizedSelectedValues = Array.isArray(selectedValues) 
    ? selectedValues.map(normalizeValue) 
    : [];
  
  const toggleOption = (value) => {
    const newValues = normalizedSelectedValues.includes(value)
      ? normalizedSelectedValues.filter(v => v !== value)
      : [...normalizedSelectedValues, value];
    
    onChange(newValues);
  };
  
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Convert selected IDs to labels for display
  const getSelectedLabels = () => {
    return normalizedSelectedValues.map(id => {
      const option = options.find(o => o.value === id);
      return option ? option.label : id; // Fall back to ID if label not found
    });
  };
  
  return (
    <div className="custom-multiselect">
      <div 
        className={`multiselect-header ${normalizedSelectedValues.length === 0 ? 'empty' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {normalizedSelectedValues.length > 0 ? (
          <div className="selected-options">
            {getSelectedLabels().map((label, index) => (
              <span key={index} className="selected-tag">
                {label}
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(normalizedSelectedValues[index]);
                  }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="placeholder-container">
            {placeholder}
          </div>
        )}
        <span className="dropdown-arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="multiselect-dropdown">
          <div className="search-container">
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="options-container">
            {filteredOptions.map(option => (
              <div 
                key={option.value} 
                className={`option ${normalizedSelectedValues.includes(option.value) ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option.value);
                }}
              >
                <input
                  type="checkbox"
                  checked={normalizedSelectedValues.includes(option.value)}
                  onChange={() => {}}
                  onClick={(e) => e.stopPropagation()}
                />
                <span>{option.label}</span>
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="no-results">{noOptionsMessage}</div>
            )}
          </div>
          <div className="controls">
            <button 
              type="button" 
              className="btn-select-all"
              onClick={(e) => {
                e.stopPropagation();
                onChange(options.map(o => o.value));
              }}
            >
              {allSelectedMessage}
            </button>
            <button 
              type="button" 
              className="btn-clear"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
            >
              Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 