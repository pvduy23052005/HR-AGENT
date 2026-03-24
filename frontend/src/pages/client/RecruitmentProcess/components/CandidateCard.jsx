import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUSES = ['applied', 'screening', 'interview', 'offer'];
const STATUS_LABELS = {
  applied: 'Ứng tuyển',
  screening: 'Sàng lọc',
  interview: 'Phỏng vấn',
  offer: 'Đề nghị'
};

const CandidateCard = ({ candidate, onStatusChange }) => {
  const navigate = useNavigate();
  const { id, candidateCode, name, position, status } = candidate;
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);
  
  const dragStartRef = useRef({ x: 0, offset: 0 });
  const cardRef = useRef(null);
  const menuRef = useRef(null);
  const menuTriggerRef = useRef(null);
  const isDownRef = useRef(false);

  const currentStatusIndex = STATUSES.indexOf(status);
  
  // Sửa lại tên biến để tránh nhầm lẫn:
  // canSwipeRightToNext: Có thể vuốt sang PHẢI để đi tới trạng thái tiếp theo
  const canSwipeRightToNext = currentStatusIndex < STATUSES.length - 1;
  // canSwipeLeftToPrev: Có thể vuốt sang TRÁI để lùi về trạng thái trước đó
  const canSwipeLeftToPrev = currentStatusIndex > 0;

  const handleMouseDown = (e) => {
    isDownRef.current = true;
    dragStartRef.current = { x: e.clientX, offset: 0 };
    setIsDragging(true);
  };

  const handleTouchStart = (e) => {
    isDownRef.current = true;
    dragStartRef.current = { x: e.touches[0].clientX, offset: 0 };
    setIsDragging(true);
  };

  const handleGlobalMouseMove = (e) => {
    if (!isDownRef.current) return;
    
    const diff = e.clientX - dragStartRef.current.x;
    dragStartRef.current.offset = diff;
    
    // ═ Cho phép kéo tự do qua bất kỳ cột nào
    // Validation sẽ xảy ra ở RecruitmentBoard (parent)
    setSwipeOffset(diff);
  };

  const handleGlobalTouchMove = (e) => {
    if (!isDownRef.current) return;
    
    const diff = e.touches[0].clientX - dragStartRef.current.x;
    dragStartRef.current.offset = diff;
    
    // ═ Cho phép kéo tự do qua bất kỳ cột nào
    // Validation sẽ xảy ra ở RecruitmentBoard (parent)
    setSwipeOffset(diff);
  };

  const handleEndDrag = () => {
    if (!isDownRef.current) return;
    
    isDownRef.current = false;
    const threshold = 30; 
    const offset = dragStartRef.current.offset;

    // ═ Cho phép kéo sang hướng nào cũng được
    // Validation sẽ được xử lý ở RecruitmentBoard (parent)
    if (offset > threshold) {
      // Kéo sang phải -> Chuyển sang cột tiếp theo
      const nextStatus = STATUSES[currentStatusIndex + 1];
      if (nextStatus) {
        onStatusChange(id, nextStatus);
      }
    } 
    else if (offset < -threshold) {
      // Kéo sang trái -> Lùi về cột trước đó
      const prevStatus = STATUSES[currentStatusIndex - 1];
      if (prevStatus) {
        onStatusChange(id, prevStatus);
      }
    }

    setSwipeOffset(0);
    setIsDragging(false);
  };

  // Global mouse/touch listeners
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('mousemove', handleGlobalMouseMove, false);
    document.addEventListener('mouseup', handleEndDrag, false);
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
    document.addEventListener('touchend', handleEndDrag, false);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleEndDrag);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleEndDrag);
    };
  }, [isDragging, currentStatusIndex, canSwipeRightToNext, canSwipeLeftToPrev, id, onStatusChange]);

  // Close menu khi click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && 
          cardRef.current && !cardRef.current.querySelector('.candidate-card__menu-trigger')?.contains(e.target)) {
        setShowMenuId(null);
      }
    };

    if (showMenuId === id) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenuId, id]);

  const getSwipeHint = () => {
    // Sửa lại text cho đúng hướng vuốt
    if (swipeOffset > 20) return 'Tiếp tục →';
    if (swipeOffset < -20) return '← Trở về';
    return 'Vuốt để chuyển';
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenuId(showMenuId === id ? null : id);
  };

  const handleStatusSelect = (newStatus) => {
    if (newStatus !== status) {
      onStatusChange(id, newStatus);
    }
    setShowMenuId(null);
  };

  return (
    <div
      ref={cardRef}
      className={`candidate-card ${isDragging ? 'candidate-card--dragging' : ''}`}
      style={{
        transform: `translateX(${swipeOffset}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.9 : 1,
        touchAction: 'none',
        userSelect: 'none'
      }}
      draggable={false}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="candidate-card__header">
        <span className="candidate-card__id">#{candidateCode}</span>
        <div className="candidate-card__header-actions">
          <span className="candidate-card__status-badge">{STATUS_LABELS[status]}</span>
          <div className="candidate-card__menu-wrapper">
            <button
              ref={menuTriggerRef}
              className="candidate-card__menu-trigger"
              onClick={handleMenuToggle}
              aria-label="Menu"
            >
              ☰
            </button>
            
            {showMenuId === id && (
              <div 
                className="candidate-card__popover" 
                ref={menuRef}
              >
                <div className="candidate-card__popover-header">
                  Trạng thái mới
                </div>
                <div className="candidate-card__popover-body">
                  {STATUSES.map(st => (
                    <button
                      key={st}
                      className={`candidate-card__popover-item ${st === status ? 'active' : ''}`}
                      onClick={() => handleStatusSelect(st)}
                    >
                      {STATUS_LABELS[st]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <h3 className="candidate-card__name">{name}</h3>
      <p className="candidate-card__position">{position}</p>
      
      {isDragging && (
        <div className="candidate-card__swipe-hint">
          {getSwipeHint()}
        </div>
      )}

      <div className="candidate-card__swipe-indicators">
        {canSwipeLeftToPrev && (
          <div className={`candidate-card__indicator candidate-card__indicator--left ${swipeOffset < -20 ? 'active' : ''}`}>
            ←
          </div>
        )}
        {canSwipeRightToNext && (
          <div className={`candidate-card__indicator candidate-card__indicator--right ${swipeOffset > 20 ? 'active' : ''}`}>
            →
          </div>
        )}
      </div>

      <div className="candidate-card__footer">
        <button
          className="candidate-card__btn-detail"
          onClick={() => navigate(`/candidates/${id}`)}
        >
          Chi tiết ứng viên
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;