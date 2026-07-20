import React, { useState, useEffect } from 'react';

const LessonCollapse = ({
  index,
  title,
  isFree,
  isOpen,
  onToggle,
  rightActions,
  children,
  mode = 'client'
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  // Sau khi transition mở xong mới bỏ overflow:hidden ở inner div
  const [fullyOpen, setFullyOpen] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setFullyOpen(false);
    } else {
      setFullyOpen(false);
      const t = setTimeout(() => setShouldRender(false), 320);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleTransitionEnd = (e) => {
    // Chỉ xử lý khi grid-template-rows transition kết thúc và đang mở
    if (e.propertyName === 'grid-template-rows' && isOpen) {
      setFullyOpen(true);
    }
  };

  return (
    <div
      className={`p-0 mb-3 ${mode === 'client' ? 'shadow-sm border-0' : 'admin-array-card'}`}
      style={{
        background: mode === 'client' ? '#fff' : '#fafafa',
        border: mode === 'client' ? '1px solid #f0f0f0' : '1px solid #eee',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className={`d-flex justify-content-between align-items-center p-${mode === 'client' ? '4' : '3'}`}
        style={{
          background: mode === 'client' ? '#fff' : (isOpen ? '#f0f0f0' : '#fff'),
          cursor: 'pointer',
          borderBottom: isOpen ? '1px solid #f0f0f0' : 'none',
          userSelect: 'none',
          transition: 'background 0.2s ease',
        }}
        onClick={onToggle}
      >
        <span style={{ fontWeight: '700', fontSize: '15px', color: mode === 'client' ? '#333' : '#c19a5b' }}>
          <i
            className={`fa fa-chevron-${isOpen ? 'down' : 'right'} mr-2`}
            style={{ width: '14px', fontSize: '12px', color: '#999' }}
          ></i>
          {isFree ? (
            <span className="badge badge-success mr-2" style={{ fontSize: '11px', padding: '4px 8px' }}>Học thử</span>
          ) : (
            mode === 'client' ? (
              <i className="fa fa-lock mr-2 text-warning" style={{ fontSize: '16px' }} title="Nội dung Premium"></i>
            ) : (
              <span className="badge badge-warning mr-2" style={{ fontSize: '11px', padding: '4px 8px' }}>
                <i className="fa fa-lock mr-1"></i>Chỉ học viên
              </span>
            )
          )}
          Bài {index + 1}: {title || 'Chưa có tiêu đề'}
        </span>
        {rightActions && (
          <div onClick={e => e.stopPropagation()}>{rightActions}</div>
        )}
      </div>

      {/* Body — Grid trick: 0fr ↔ 1fr, không cần đo height */}
      {shouldRender && (
        <div
          onTransitionEnd={handleTransitionEnd}
          style={{
            display: 'grid',
            gridTemplateRows: isOpen ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.3s ease, opacity 0.25s ease',
            opacity: isOpen ? 1 : 0,
          }}
        >
          {/* overflow:hidden trong khi animate, visible sau khi mở xong để video không bị clip */}
          <div style={{ overflow: fullyOpen ? 'visible' : 'hidden' }}>
            <div
              className="p-4"
              style={{ background: mode === 'client' ? '#fcfcfc' : 'transparent' }}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonCollapse;
