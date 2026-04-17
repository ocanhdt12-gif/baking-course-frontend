import React from 'react';
import AdminButton from './Shared/AdminButton';

const AdminModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" style={{}}>
      <div className="admin-modal" style={{ position: 'relative' }}>
        <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{title}</h4>
          <button 
            type="button"
            onClick={onClose} 
            className="admin-modal-close-icon-only"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              padding: 0,
              cursor: 'pointer',
              color: '#64748b',
              fontSize: '20px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
            title="Đóng (Close)"
          >
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

