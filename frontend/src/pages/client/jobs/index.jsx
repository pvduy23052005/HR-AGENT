import React, { useState, useMemo, useEffect } from 'react';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import jobService from '../../../services/client/jobService';
// Import CSS mình vừa tạo
import '../../../styles/client/pages/jobList.css';

const FILTER_ALL = 'ALL';
const FILTER_ACTIVE = 'ACTIVE';
const FILTER_CLOSED = 'CLOSED';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getAll();
      setJobs(res.jobs || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách job:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === FILTER_ACTIVE) matchesStatus = job.status === true;
      if (statusFilter === FILTER_CLOSED) matchesStatus = job.status === false;
      
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const handleViewDetail = (job) => {
    setSelectedJob(job);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="job-list-page">
      <div className="job-list__header">
        <h1 className="job-list__title">Danh Sách Công Việc</h1>
        <p className="job-list__subtitle">Quản lý và theo dõi các vị trí tuyển dụng chuyên nghiệp</p>
      </div>

      <div className="job-list__controls">
        <div className="job-list__search">
          <svg className="job-list__search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề công việc..."
            className="job-list__search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="job-list__filters">
          <button
            onClick={() => setStatusFilter(FILTER_ALL)}
            className={`job-list__filter-btn job-list__filter-btn--all ${statusFilter === FILTER_ALL ? 'active' : ''}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setStatusFilter(FILTER_ACTIVE)}
            className={`job-list__filter-btn job-list__filter-btn--active ${statusFilter === FILTER_ACTIVE ? 'active' : ''}`}
          >
            Đang tuyển
          </button>
          <button
            onClick={() => setStatusFilter(FILTER_CLOSED)}
            className={`job-list__filter-btn job-list__filter-btn--closed ${statusFilter === FILTER_CLOSED ? 'active' : ''}`}
          >
            Đã đóng
          </button>
        </div>
      </div>

      <div className="job-list__meta">
        <h2 className="job-list__meta-title">Kết quả tìm kiếm</h2>
        <div className="job-list__meta-count">
          <span>{filteredJobs.length}</span> công việc
        </div>
      </div>

      {loading ? (
        <div className="job-list__loading">
          <div className="job-list__spinner"></div>
          <span>Đang tải danh sách công việc...</span>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="job-list__grid">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onViewDetail={handleViewDetail} 
            />
          ))}
        </div>
      ) : (
        <div className="job-list__empty">
          <div className="job-list__empty-icon">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3>Không tìm thấy công việc nào</h3>
          <p>Không có công việc nào khớp với tìm kiếm hoặc bộ lọc hiện tại của bạn.</p>
          <button 
            onClick={() => { setSearchTerm(''); setStatusFilter(FILTER_ALL); }}
            className="job-list__filter-clear-btn"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default JobList;
