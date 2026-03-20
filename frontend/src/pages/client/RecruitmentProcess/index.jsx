import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Column from './components/Column';
import candidateService from '../../../services/client/candidateService';
import '../../../styles/client/pages/recruitmentBoard.css';

const COLUMNS = [
  // Cột mặc định tương ứng với status trong DB
  { id: 'applied', title: 'Ứng tuyển', colorClass: 'kanban-column--applied' },
  { id: 'screening', title: 'Sàng lọc', colorClass: 'kanban-column--screening' },
  { id: 'interview', title: 'Phỏng vấn', colorClass: 'kanban-column--interview' },
  { id: 'offer', title: 'Đề nghị', colorClass: 'kanban-column--offer' },
  // Cột ẩn chứa các trạng thái cũ/khác nếu có (tuỳ chọn)
];

// Fallback status mapping nếu Backend trả về các status cũ
const STATUS_MAPPING = {
  unverified: 'applied',
  verified: 'screening',
  scheduled: 'interview',
  risky: 'applied'
};

const RecruitmentBoard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await candidateService.getAll();
      
      const mappedCandidates = (res.candidates || []).map(c => {
        // Map old status to new Kanban status if needed
        let kanbanStatus = c.status;
        if (!COLUMNS.find(col => col.id === kanbanStatus)) {
             kanbanStatus = STATUS_MAPPING[kanbanStatus] || 'applied';
        }
        
        return {
          id: c.id,
          candidateCode: c.id.substring(0, 6).toUpperCase(), // Fake ID ngắn
          name: c.fullName,
          position: (c.topSkills && c.topSkills.length > 0) ? c.topSkills[0] : 'Chưa cập nhật',
          status: kanbanStatus
        };
      });
      
      setCandidates(mappedCandidates);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách ứng viên!');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      // Optimistic update
      setCandidates(prevCandidates => 
        prevCandidates.map(c => 
          c.id === candidateId ? { ...c, status: newStatus } : c
        )
      );

      // Real API Call
      console.log('Calling updateStatus with:', candidateId, newStatus);
      const updateRes = await candidateService.updateStatus(candidateId, newStatus);
      console.log('Update response:', updateRes);
      
      toast.success('Cập nhật trạng thái thành công!');
      
      // Fetch lại dữ liệu từ server để đảm bảo sync
      setTimeout(() => {
        fetchCandidates();
      }, 500);
      
      // Lưu vào localStorage để báo cáo biết cập nhật (cross-tab sync)
      const syncData = {
        timestamp: Date.now(),
        candidateId,
        newStatus,
        type: 'candidate-status-changed'
      };
      localStorage.setItem('hr-agent-sync', JSON.stringify(syncData));
      console.log('Saved sync data to localStorage:', syncData);
      
      // Dispatch custom event để Report page có thể lắng nghe (same-tab sync)
      window.dispatchEvent(new CustomEvent('candidate-status-changed', {
        detail: { candidateId, newStatus, timestamp: Date.now() }
      }));
      console.log('Dispatched candidate-status-changed event');
      
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái', error);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      // Rollback (Fetch lại hoặc lưu state prev)
      fetchCandidates(); 
    }
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="recruitment-page">
      <div className="recruitment-page__header">
        <h1 className="recruitment-page__title">Quy trình tuyển dụng</h1>
      </div>

      <div className="kanban-board">
        {COLUMNS.map(col => {
          const colCandidates = candidates.filter(c => c.status === col.id);
          return (
            <Column
              key={col.id}
              title={col.title}
              colorClass={col.colorClass}
              candidates={colCandidates}
              onStatusChange={handleStatusChange}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RecruitmentBoard;
