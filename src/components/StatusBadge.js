import React from 'react';
import { Badge } from 'react-bootstrap';

const StatusBadge = ({ children, type }) => {
  const getVariant = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'danger';
      case 'info':
        return 'info';
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Badge bg={getVariant()} pill className="px-3 py-2">
      {children}
    </Badge>
  );
};

export default StatusBadge; 