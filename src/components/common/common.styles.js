import styled from 'styled-components';

// Card Components
export const StyledCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

export const StyledCardHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
`;

export const StyledCardBody = styled.div`
  padding: 20px;
`;

// Badge Components
export const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => 
    props.status === 'Aktif' || props.status === 'Onaylandı' ? '#e6f7ee' : 
    props.status === 'Pasif' || props.status === 'İptal Edildi' ? '#fee8e7' : 
    props.status === 'Beklemede' ? '#fff4de' : 
    props.status === 'Tamamlandı' ? '#deebff' : '#f0f0f0'};
  color: ${props => 
    props.status === 'Aktif' || props.status === 'Onaylandı' ? '#0d6832' : 
    props.status === 'Pasif' || props.status === 'İptal Edildi' ? '#d63031' : 
    props.status === 'Beklemede' ? '#e2a03f' : 
    props.status === 'Tamamlandı' ? '#0747a6' : '#4a5568'};
`;

// Filter Panel Components
export const FilterPanel = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaedf2;
  position: relative;
  overflow: hidden;
  margin-top: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(to bottom, #2563eb, #1e40af);
  }
`;

export const FilterTitle = styled.h6`
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 20px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
    background-color: rgba(37, 99, 235, 0.1);
    padding: 8px;
    border-radius: 8px;
  }
`;

export const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

export const FilterColumn = styled.div`
  flex: 1;
  min-width: 200px;
`;

export const FilterLabel = styled.label`
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.9rem;
  display: block;
`;

export const FilterInput = styled.input`
  width: 100%;
  border-radius: 8px;
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  background-color: #f8f9fa;
  padding-left: ${props => props.hasIcon ? '40px' : '15px'};

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    background-color: #fff;
    outline: none;
  }

  &::placeholder {
    color: #a0aec0;
    font-style: italic;
  }
`;

export const FilterSelect = styled.select`
  width: 100%;
  border-radius: 8px;
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  background-color: #f8f9fa;
  appearance: auto;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    background-color: #fff;
    outline: none;
  }
`;

export const SearchIconWrapper = styled.div`
  position: relative;
  width: 100%;
  
  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
  }
`;

// Button Components
export const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-right: 10px;
  font-size: 0.9rem;
  
  &:last-child {
    margin-right: 0;
  }
  
  svg {
    margin-right: 6px;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
`;

export const PrimaryButton = styled(ActionButton)`
  background-color: #2563eb;
  color: white;
  border: none;
  
  &:hover {
    background-color: #1e40af;
  }
`;

export const SecondaryButton = styled(ActionButton)`
  background-color: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

export const DangerButton = styled(ActionButton)`
  background-color: #E53E3E;
  color: white;
  border: none;
  padding: 6px 8px;
  border-radius: 6px;
  
  &:hover {
    background-color: #C53030;
  }
`;

export const EditButton = styled(ActionButton)`
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 6px 8px;
  border-radius: 6px;
  
  &:hover {
    background-color: #2c5282;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Header Components
export const ActionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h4 {
    font-weight: 600;
    color: #2d3748;
    margin: 0;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 10px;
      color: #2563eb;
    }
  }
`;

// DataTable Styles
export const dataTableCustomStyles = {
  headRow: {
    style: {
      backgroundColor: '#f8f9fa',
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: '#dfe3e8',
    },
  },
  headCells: {
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
  rows: {
    style: {
      fontSize: '14px',
      paddingLeft: '16px',
      paddingRight: '16px',
    },
    highlightOnHoverStyle: {
      backgroundColor: '#f5f6f8',
      borderBottomColor: '#EDEDED',
      outline: '1px solid #EDEDED',
    },
  },
  cells: {
    style: {
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
};

// Additional Filter Components
export const FilterTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
`;

export const FilterTag = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: #edf2f7;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 0.8rem;
  color: #4a5568;
  font-weight: 500;
  
  svg {
    cursor: pointer;
    margin-left: 8px;
    opacity: 0.7;
    transition: all 0.2s ease;
    
    &:hover {
      opacity: 1;
      color: #2563eb;
    }
  }
`;

export const ClearAllButton = styled.button`
  background-color: transparent;
  border: none;
  color: #2563eb;
  font-size: 0.85rem;
  padding: 0;
  cursor: pointer;
  font-weight: 500;
  margin-left: 15px;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const FilterActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  border-radius: 8px;
  padding: 0 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &.search {
    background-color: #2563eb;
    color: white;
    border: none;
    
    &:hover {
      background-color: #1e40af;
    }
    
    svg {
      margin-right: 8px;
    }
  }
  
  &.clear {
    background-color: #f8f9fa;
    color: #4a5568;
    border: 1px solid #cbd5e0;
    
    &:hover {
      background-color: #edf2f7;
    }
    
    svg {
      margin-right: 8px;
    }
  }
`; 