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
  
  const toggleOption = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };
  
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="custom-multiselect">
      <div 
        className={`multiselect-header ${selectedValues.length === 0 ? 'empty' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length > 0 ? (
          <div className="selected-options">
            {selectedValues.map(value => (
              <span key={value} className="selected-tag">
                {options.find(o => o.value === value)?.label}
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(value);
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
                className={`option ${selectedValues.includes(option.value) ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option.value);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
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