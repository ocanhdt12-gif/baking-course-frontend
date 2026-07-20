import React, { useRef, useEffect, useState } from 'react';

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
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isFullyOpen, setIsFullyOpen] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (shouldRender && bodyRef.current) {
      setHeight(bodyRef.current.scrollHeight);
    }
    if (!isOpen) {
      // Capture current height before collapsing so animation works
      if (bodyRef.current) {
        setHeight(bodyRef.current.scrollHeight);
      }
      setIsFullyOpen(false);
      // Next frame: set to 0 to trigger the CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(0));
      });
      const timer = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timer);
    } else if (shouldRender) {
      // After opening, switch to max-height: none so iframe/video can expand freely
      const timer = setTimeout(() => setIsFullyOpen(true), 260);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  return (
    <div 
      className={`p-0 mb-3 ${mode === 'client' ? 'shadow-sm border-0' : 'admin-array-card'}`} 
      style={{ 
        background: mode === 'client' ? '#fff' : '#fafafa', 
        border: mode === 'client' ? '1px solid #f0f0f0' : '1px solid #eee', 
        overflow: isFullyOpen ? 'visible' : 'hidden', 
        borderRadius: '12px' 
      }}
    >
      {/* Collapse Header */}
      <div 
        className={`d-flex justify-content-between align-items-center p-${mode === 'client' ? '4' : '3'}`}
        style={{ 
          background: mode === 'client' ? '#fff' : (isOpen ? '#f0f0f0' : '#fff'), 
          cursor: 'pointer', 
          borderBottom: isOpen ? '1px solid #f0f0f0' : 'none',
          userSelect: 'none',
          transition: 'background 0.2s ease'
        }}
        onClick={onToggle}
      >
        <span style={{ fontWeight: '700', fontSize: '15px', color: mode === 'client' ? '#333' : '#c19a5b' }}>
          <i 
            className={`fa fa-chevron-${isOpen ? 'down' : 'right'} mr-2`} 
            style={{ 
              width: '14px', fontSize: '12px', color: '#999',
              transition: 'transform 0.25s ease',
              transform: isOpen ? 'rotate(0deg)' : 'rotate(0deg)'
            }}
          ></i>
          {isFree ? (
            <span className="badge badge-success mr-2" style={{ fontSize: '11px', padding: '4px 8px' }}>Học thử</span>
          ) : (
            mode === 'client' ? (
              <i className="fa fa-lock mr-2 text-warning" style={{ fontSize: '16px' }} title="Nội dung Premium"></i>
            ) : (
              <span className="badge badge-warning mr-2" style={{ fontSize: '11px', padding: '4px 8px' }}><i className="fa fa-lock mr-1"></i>Chỉ học viên</span>
            )
          )}
          Bài {index + 1}: {title || 'Chưa có tiêu đề'}
        </span>
        {rightActions && (
          <div onClick={e => e.stopPropagation()}>
            {rightActions}
          </div>
        )}
      </div>

      {/* Collapse Body with Animation */}
      {shouldRender && (
        <div 
          style={{ 
            maxHeight: isFullyOpen ? 'none' : (isOpen ? `${height}px` : '0px'),
            transition: isFullyOpen ? 'none' : 'max-height 0.25s ease-out, opacity 0.2s ease',
            opacity: isOpen ? 1 : 0,
            overflow: 'hidden'
          }}
        >
          <div ref={bodyRef} className="p-4" style={{ background: mode === 'client' ? '#fcfcfc' : 'transparent' }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonCollapse;
