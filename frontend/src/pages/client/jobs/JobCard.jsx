import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, onViewDetail }) => {
  const navigate = useNavigate();

  const handleViewCandidates = () => {
    navigate(`/jobs/${job.id || job._id}/candidates`);
  };

  const formattedDate = new Date(job.createdAt).toLocaleDateString("vi-VN", {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="job-card">
      <div className="job-card__main">
        <div className="job-card__title-row">
          <h3 className="job-card__title" title={job.title}>
            {job.title}
          </h3>
          <span 
            className={`job-card__badge ${
              job.status ? 'job-card__badge--open' : 'job-card__badge--closed'
            }`}
          >
            {job.status ? "Đang tuyển" : "Đã đóng"}
          </span>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="job-card__reqs">
            {job.requirements.map((req, idx) => (
              <span key={idx} className="job-card__tag">
                {req}
              </span>
            ))}
          </div>
        )}

        <div className="job-card__date">
          <svg fill="none" width="16" height="16" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Ngày tạo: {formattedDate}
        </div>
      </div>

      <div className="job-card__actions">
        <button 
          onClick={() => onViewDetail(job)}
          className="job-card__btn job-card__btn--primary"
        >
          Xem chi tiết
        </button>
        <button 
          onClick={handleViewCandidates}
          className="job-card__btn job-card__btn--secondary"
        >
          Danh sách ứng viên
        </button>
      </div>
    </div>
  );
};

export default JobCard;
