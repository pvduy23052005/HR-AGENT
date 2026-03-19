import React, { useState, useRef, useEffect } from 'react';

const STATUSES = ['applied', 'screening', 'interview', 'offer'];
const STATUS_LABELS = {
  applied: 'Ứng tuyển',
  screening: 'Sàng lọc',
  interview: 'Phỏng vấn',
  offer: 'Đề nghị'
};

const CandidateCard = ({ candidate, onStatusChange }) => {
  const { id, candidateCode, name, position, status } = candidate;
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartRef = useRef({ x: 0, offset: 0 });
  const cardRef = useRef(null);
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
    
    let limitedDiff = diff;
    // Kéo sang phải (diff > 0) nhưng không có cột tiếp theo -> hãm lại
    if (diff > 0 && !canSwipeRightToNext) limitedDiff = diff * 0.3;
    // Kéo sang trái (diff < 0) nhưng không có cột trước đó -> hãm lại
    if (diff < 0 && !canSwipeLeftToPrev) limitedDiff = diff * 0.3;
    
    setSwipeOffset(limitedDiff);
  };

  const handleGlobalTouchMove = (e) => {
    if (!isDownRef.current) return;
    
    const diff = e.touches[0].clientX - dragStartRef.current.x;
    dragStartRef.current.offset = diff;
    
    let limitedDiff = diff;
    if (diff > 0 && !canSwipeRightToNext) limitedDiff = diff * 0.3;
    if (diff < 0 && !canSwipeLeftToPrev) limitedDiff = diff * 0.3;
    
    setSwipeOffset(limitedDiff);
  };

  const handleEndDrag = () => {
    if (!isDownRef.current) return;
    
    isDownRef.current = false;
    const threshold = 30; 
    const offset = dragStartRef.current.offset;

    // Sửa lại logic: Vuốt sang PHẢI (offset dương) -> Chuyển cột tiếp theo
    if (offset > threshold && canSwipeRightToNext) {
      const nextStatus = STATUSES[currentStatusIndex + 1];
      onStatusChange(id, nextStatus);
    } 
    // Vuốt sang TRÁI (offset âm) -> Lùi về cột trước đó
    else if (offset < -threshold && canSwipeLeftToPrev) {
      const prevStatus = STATUSES[currentStatusIndex - 1];
      onStatusChange(id, prevStatus);
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

  const getSwipeHint = () => {
    // Sửa lại text cho đúng hướng vuốt
    if (swipeOffset > 20) return 'Tiếp tục →';
    if (swipeOffset < -20) return '← Trở về';
    return 'Vuốt để chuyển';
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
        <span className="candidate-card__status-badge">{STATUS_LABELS[status]}</span>
      </div>
      <h3 className="candidate-card__name">{name}</h3>
      <p className="candidate-card__position">{position}</p>
      
      {isDragging && (
        <div className="candidate-card__swipe-hint">
          {getSwipeHint()}
        </div>
      )}

      <div className="candidate-card__swipe-indicators">
        {/* Mũi tên trái xuất hiện khi lùi về */}
        {canSwipeLeftToPrev && (
          <div className={`candidate-card__indicator candidate-card__indicator--left ${swipeOffset < -20 ? 'active' : ''}`}>
            ←
          </div>
        )}
        {/* Mũi tên phải xuất hiện khi đi tiếp */}
        {canSwipeRightToNext && (
          <div className={`candidate-card__indicator candidate-card__indicator--right ${swipeOffset > 20 ? 'active' : ''}`}>
            →
          </div>
        )}
      </div>

      <div className="candidate-card__footer">
        <button
          className="candidate-card__btn-detail"
          onClick={() => console.log('View details for', id)}
        >
          Chi tiết ứng viên
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;