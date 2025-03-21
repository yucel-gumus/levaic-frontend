import React from 'react';

/**
 * Form satırı bileşeni
 * @param {Object} props - Bileşen özellikleri
 * @param {React.ReactNode} props.children - Satır içeriği
 * @param {string} props.className - Ek CSS sınıfı
 * @returns {JSX.Element}
 */
const FormRow = ({ children, className = '', ...props }) => {
  return (
    <div className={`row mb-3 ${className}`} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!child) return null;
        
        // Get the colWidth from the child's props or use default
        const childArray = React.Children.toArray(children);
        const validChildrenCount = childArray.filter(Boolean).length;
        
        let colClassName = `col-md-${12 / validChildrenCount}`;
        
        // If child has colWidth prop, use it instead
        if (child.props && child.props.colWidth) {
          colClassName = child.props.colWidth;
          
          // Create a new child without the colWidth prop
          const { colWidth, ...childPropsWithoutColWidth } = child.props;
          
          if (React.isValidElement(child)) {
            child = React.cloneElement(child, childPropsWithoutColWidth);
          }
        }
        
        return (
          <div key={index} className={colClassName}>
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default FormRow; 