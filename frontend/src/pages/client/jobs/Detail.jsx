import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import jobService from '../../../services/client/jobService';
import '../../../styles/client/pages/jobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(location.state?.editMode || false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    status: true
  });

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const res = await jobService.getJobById(id);
      let foundJob = null;
      if (res.job) foundJob = res.job;
      else if (res.success && res.data?.job) foundJob = res.data.job;
      else foundJob = res.data || res;

      if (foundJob) {
        setJob(foundJob);
        resetFormData(foundJob);
      }
    } catch (err) {
      console.error("Lỗi tải chi tiết công việc:", err);
      setError("Không thể tải chi tiết công việc. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchJobDetail();
  }, [id]);

  const resetFormData = (jobData) => {
    setFormData({
      title: jobData.title || '',
      description: jobData.description || '',
      requirements: jobData.requirements ? jobData.requirements.join(', ') : '',
      status: jobData.status !== undefined ? jobData.status : true
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    resetFormData(job);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Chuyển string requirements thành mảng array
      const reqArray = formData.requirements
        .split(',')
        .map(r => r.trim())
        .filter(r => r.length > 0);

      const updatePayload = {
        title: formData.title,
        description: formData.description,
        requirements: reqArray,
        status: formData.status === 'true' || formData.status === true
      };

      const res = await jobService.updateJob(id, updatePayload);
      if (res.success) {
        // Cập nhật state nội bộ
        const updatedJob = res.updatedJob || res.data?.updatedJob || res.job || { ...job, ...updatePayload };
        setJob(updatedJob);
        resetFormData(updatedJob);
        setIsEditing(false);
        toast.success("Cập nhật công việc thành công!");
      } else {
        toast.error(res.message || "Có lỗi xảy ra khi cập nhật!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi kết nối đến máy chủ.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="jd-page">
        <div className="jd-loading">
          <div className="jd-spinner"></div>
          <span>Đang tải thông tin chi tiết...</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="jd-page">
        <div className="jd-error">
          <h3>Oops! Có lỗi xảy ra.</h3>
          <p>{error || "Không tìm thấy thông tin công việc."}</p>
          <button className="jd-back-btn" onClick={() => navigate('/jobs')} style={{ display: 'inline-flex', marginTop: 16 }}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(job.createdAt).toLocaleDateString("vi-VN", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="jd-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button className="jd-back-btn" style={{ marginBottom: 0 }} onClick={() => navigate('/jobs')}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách công việc
        </button>

        <div className="jd-header-actions">
          {isEditing ? (
            <>
              <button className="jd-cancel-btn" onClick={handleCancelEdit} disabled={isSaving}>Hủy</button>
              <button className="jd-save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </>
          ) : (
            <button className="jd-edit-btn" onClick={() => setIsEditing(true)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      <div className="jd-header-card">
        <div className="jd-header-top">
          {isEditing ? (
            <div style={{ width: '100%' }}>
              <label className="jd-input-label">Tiêu đề công việc</label>
              <input 
                className="jd-input" 
                style={{ fontSize: '1.5rem', fontWeight: 700 }}
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
          ) : (
            <h1 className="jd-title">{job.title}</h1>
          )}

          <div className="jd-badges" style={isEditing ? { marginTop: 16 } : {}}>
            {isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label className="jd-input-label" style={{ marginBottom: 0 }}>Trạng thái:</label>
                <select 
                  className="jd-select"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value={true}>Đang tuyển dụng</option>
                  <option value={false}>Đã đóng</option>
                </select>
              </div>
            ) : (
              <span className={`jd-badge ${job.status ? 'jd-badge--open' : 'jd-badge--closed'}`}>
                <span style={{ marginRight: 6 }}>●</span>
                {job.status ? "Đang tuyển dụng" : "Đã đóng"}
              </span>
            )}
          </div>
        </div>

        <div className="jd-meta-list">
          <div className="jd-meta-item">
            <svg className="jd-meta-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ID Công việc: {job.id || job._id}
          </div>
          <div className="jd-meta-item">
            <svg className="jd-meta-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ngày tạo: {formattedDate}
          </div>
        </div>
      </div>

      <div className="jd-content-grid">
        <div className="jd-card">
          <h2 className="jd-section-title">
            <div className="jd-section-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            Mô tả công việc
          </h2>
          
          {isEditing ? (
            <textarea 
              className="jd-input jd-textarea" 
              placeholder="Nhập mô tả công việc chi tiết..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          ) : job.description ? (
            <div className="jd-desc-text" dangerouslySetInnerHTML={{ __html: job.description }} />
          ) : (
            <div className="jd-desc-text">
              <span className="jd-empty-text">Chưa có thông tin mô tả chi tiết cho công việc này.</span>
            </div>
          )}
        </div>

        <div className="jd-card">
          <h2 className="jd-section-title">
            <div className="jd-section-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Yêu cầu kỹ năng
          </h2>
          
          {isEditing ? (
            <div>
              <label className="jd-input-label" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>
                Phân cách các kỹ năng bằng dấu phẩy (,)
              </label>
              <textarea 
                className="jd-input" 
                style={{ minHeight: '80px', resize: 'vertical' }}
                placeholder="VD: ReactJS, Node.js, TypeScript"
                value={formData.requirements}
                onChange={e => setFormData({...formData, requirements: e.target.value})}
              />
            </div>
          ) : (
            <div className="jd-tags-wrap">
              {job.requirements?.length > 0 ? (
                job.requirements.map((req, idx) => (
                  <span key={idx} className="jd-tag">
                    {req}
                  </span>
                ))
              ) : (
                <span className="jd-empty-text">Chưa có yêu cầu kỹ năng cụ thể.</span>
              )}
            </div>
          )}
          
          <Link to={`/jobs/${job.id || job._id}/candidates`} className="jd-btn" style={{ marginTop: 32 }}>
            Xem danh sách ứng viên
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
