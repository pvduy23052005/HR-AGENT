import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  const [menuOpen, setMenuOpen] = useState(false);
  // Vị trí tuyệt đối của dropdown (tính từ trigger button)
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const dragStartRef = useRef({ x: 0, offset: 0 });
  const cardRef = useRef(null);
  const menuRef = useRef(null);
  const menuTriggerRef = useRef(null);
  const isDownRef = useRef(false);

  const currentStatusIndex = STATUSES.indexOf(status);
  const canSwipeRightToNext = currentStatusIndex < STATUSES.length - 1;
  const canSwipeLeftToPrev = currentStatusIndex > 0;

  // ─── Drag / Swipe handlers ────────────────────────────────────────────────

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

  const handleGlobalMouseMove = useCallback((e) => {
    if (!isDownRef.current) return;
    const diff = e.clientX - dragStartRef.current.x;
    dragStartRef.current.offset = diff;
    setSwipeOffset(diff);
  }, []);

  const handleGlobalTouchMove = useCallback((e) => {
    if (!isDownRef.current) return;
    const diff = e.touches[0].clientX - dragStartRef.current.x;
    dragStartRef.current.offset = diff;
    setSwipeOffset(diff);
  }, []);

  const handleEndDrag = useCallback(() => {
    if (!isDownRef.current) return;
    isDownRef.current = false;
    const threshold = 30;
    const offset = dragStartRef.current.offset;
    const columnWidth = 330;
    const distanceDragged = Math.abs(offset) / columnWidth;

    if (Math.abs(offset) > threshold) {
      if (distanceDragged > 1) {
        toast.error('Quy trình không hợp lệ!');
        setSwipeOffset(0);
        setIsDragging(false);
        return;
      }
      if (offset > threshold && canSwipeRightToNext) {
        const nextStatus = STATUSES[currentStatusIndex + 1];
        if (nextStatus) onStatusChange(id, nextStatus);
      } else if (offset < -threshold && canSwipeLeftToPrev) {
        const prevStatus = STATUSES[currentStatusIndex - 1];
        if (prevStatus) onStatusChange(id, prevStatus);
      }
    }

    setSwipeOffset(0);
    setIsDragging(false);
  }, [canSwipeRightToNext, canSwipeLeftToPrev, currentStatusIndex, id, onStatusChange]);

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
  }, [isDragging, handleGlobalMouseMove, handleGlobalTouchMove, handleEndDrag]);

  // ─── Popover / Menu handlers ──────────────────────────────────────────────

  /**
   * Tính vị trí dropdown từ button trigger rồi render vào document.body (Portal).
   * Cách này bypass hoàn toàn mọi `overflow: hidden` của ancestor trong layout.
   */
  const handleMenuToggle = (e) => {
    e.stopPropagation();
    if (!menuOpen && menuTriggerRef.current) {
      const rect = menuTriggerRef.current.getBoundingClientRect();
      setPopoverPos({
        // Dưới button + scroll offset
        top: rect.bottom + window.scrollY + 4,
        // Canh phải: mép phải button
        left: rect.right + window.scrollX,
      });
    }
    setMenuOpen(prev => !prev);
  };

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        menuTriggerRef.current && !menuTriggerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  const handleStatusSelect = (newStatus) => {
    if (newStatus === status) { setMenuOpen(false); return; }
    const currentIndex = STATUSES.indexOf(status);
    const newIndex = STATUSES.indexOf(newStatus);
    if (Math.abs(newIndex - currentIndex) > 1) {
      toast.error('Quy trình không hợp lệ!');
      setMenuOpen(false);
      return;
    }
    onStatusChange(id, newStatus);
    setMenuOpen(false);
  };

  const getSwipeHint = () => {
    if (swipeOffset > 20) return 'Tiếp tục →';
    if (swipeOffset < -20) return '← Trở về';
    return 'Vuốt để chuyển';
  };

  // ─── Popover Portal ───────────────────────────────────────────────────────
  const popoverEl = menuOpen ? ReactDOM.createPortal(
    <div
      ref={menuRef}
      className="candidate-card__popover"
      style={{
        position: 'fixed',
        top: popoverPos.top - window.scrollY,   // fixed không cần scroll offset
        left: popoverPos.left,
        transform: 'translateX(-100%)',          // dịch sang trái để canh phải button
        zIndex: 99999,
      }}
      onMouseDown={(e) => e.stopPropagation()}
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
    </div>,
    document.body
  ) : null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <div
        ref={cardRef}
        className={`candidate-card ${isDragging ? 'candidate-card--dragging' : ''}`}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: isDragging ? 0.9 : 1,
          touchAction: 'none',
          userSelect: 'none',
          width: '100%',       // đảm bảo thẻ chiếm full width cột
          boxSizing: 'border-box',
        }}
        draggable={false}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="candidate-card__header">
          <span className="candidate-card__id">#{candidateCode}</span>
          <div className="candidate-card__header-actions">
            <span className="candidate-card__status-badge">{STATUS_LABELS[status]}</span>
            {/* Wrapper chỉ cần display: inline-flex, không cần position: relative nữa vì dùng portal */}
            <div className="candidate-card__menu-wrapper">
              <button
                ref={menuTriggerRef}
                className="candidate-card__menu-trigger"
                onClick={handleMenuToggle}
                aria-label="Menu"
              >
                ☰
              </button>
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
            onClick={(e) => { e.stopPropagation(); navigate(`/candidates/${id}`); }}
          >
            Chi tiết ứng viên
          </button>
        </div>
      </div>

      {/* Dropdown render vào body, thoát khỏi flow của layout hoàn toàn */}
      {popoverEl}
    </>
  );
};

export default CandidateCard;