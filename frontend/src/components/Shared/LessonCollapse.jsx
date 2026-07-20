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
  const [shouldRender, setShouldRender] = useState(isOpen);
  // closingHeight: chỉ dùng khi đang đóng để animate từ px → 0
  const [closingHeight, setClosingHeight] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setClosingHeight(null); // reset, mở thì không cần giới hạn max-height
    } else {
      // Bắt đầu đóng: đo chiều cao thực tế rồi animate về 0
      if (bodyRef.current) {
        const h = bodyRef.current.scrollHeight;
        setClosingHeight(h);
        // Frame tiếp theo mới set về 0 để CSS transition kịp kích hoạt
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setClosingHeight(0));
        });
      }
      const timer = setTimeout(() => {
        setShouldRender(false);
        setClosingHeight(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Khi mở: max-height rất lớn → nội dung hiện hết, kể cả video 16:9
  // Khi đóng: animate từ closingHeight → 0
  const isClosing = !isOpen && closingHeight !== null;
  const maxHeight = isClosing
    ? `${closingHeight}px`
    : isOpen
    ? '9999px'
    : '0px';

  // Transition chỉ cần khi đóng (từ px → 0) vì khi mở 9999px không visible
  // Dùng ease-in-out với duration phù hợp
  const transition = isClosing
    ? 'max-height 0.3s ease-in-out, opacity 0.25s ease'
    : isOpen
    ? 'opacity 0.25s ease'
    : 'max-height 0.3s ease-in-out, opacity 0.25s ease';

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

      {/* Collapse Body */}
      {shouldRender && (
        <div 
          style={{ 
            maxHeight,
            transition,
            opacity: isOpen ? 1 : 0,
            overflow: 'hidden',
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
