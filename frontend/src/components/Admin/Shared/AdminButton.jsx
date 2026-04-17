import React from 'react';

const AdminButton = ({ 
  label, 
  icon, 
  variant = 'primary', // primary (maincolor), secondary, danger, warning, success, info, dark
  outline = false,
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false,
  size = 'md', // sm, md, lg
  style = {}
}) => {
  // Map variant to Bootstrap classes or custom CSS classes
  const getVariantClass = () => {
    if (variant === 'primary') return outline ? 'btn-outline-maincolor' : 'btn-maincolor';
    return outline ? `btn-outline-${variant}` : `btn-${variant}`;
  };

  const getSizeClass = () => {
    if (size === 'sm') return 'btn-sm';
    if (size === 'lg') return 'btn-lg';
    return '';
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontWeight: '500',
        ...style
      }}
    >
      {icon && <i className={`fa fa-${icon}`}></i>}
      {label && <span>{label}</span>}
    </button>
  );
};

export default AdminButton;
