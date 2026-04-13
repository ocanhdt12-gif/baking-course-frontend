import React from 'react';

const AdminModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h4>{title}</h4>
          <button onClick={onClose} className="admin-modal-close">
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="admin-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
