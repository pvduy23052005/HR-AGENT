const JobDetailModal = ({ job, onClose }) => {
  if (!job) return null;

  const formattedDate = new Date(job.createdAt).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log(job);

  return (
    <div className="job-modal-overlay">
      <div className="job-modal" role="dialog">
        <div className="job-modal__header">
          <h2>{job.title}</h2>
          <button
            onClick={onClose}
            className="job-modal__close"
            aria-label="Đóng"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="job-modal__body custom-scrollbar">
          <div className="job-modal__grid">
            <div className="job-modal__box">
              <div className="job-modal__box-label">Mã tham chiếu (ID)</div>
              <div className="job-modal__box-value">{job.id || job._id}</div>
            </div>

            <div className="job-modal__box">
              <div className="job-modal__box-label">Trạng thái tuyển dụng</div>
              <div
                className={`job-modal__status ${job.status ? "job-modal__status--open" : "job-modal__status--closed"}`}
              >
                <span className="job-modal__status-dot"></span>
                {job.status ? "Đang tuyển" : "Đã đóng"}
              </div>
            </div>
          </div>

          <div>
            <h3 className="job-modal__section-title">
              <div className="job-modal__section-icon">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              Mô tả công việc
            </h3>
            {job.description ? (
              <div
                className="job-modal__desc-text"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            ) : (
              <div className="job-modal__desc-text">
                <span className="job-modal__empty-text">
                  Chưa có thông tin mô tả chi tiết cho công việc này.
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="job-modal__section-title">
              <div className="job-modal__section-icon">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              Yêu cầu kỹ năng
            </h3>
            <div className="job-modal__tags-wrap">
              {job.requirements?.length > 0 ? (
                job.requirements.map((req, idx) => (
                  <span key={idx} className="job-modal__tag">
                    {req}
                  </span>
                ))
              ) : (
                <span className="job-modal__empty-text">
                  Chưa có yêu cầu kỹ năng cụ thể.
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="job-modal__section-title">
              <div className="job-modal__section-icon job-modal__section-icon--gray">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              Ngày tạo
            </h3>
            <div className="job-modal__date">{formattedDate}</div>
          </div>
        </div>

        <div className="job-modal__footer">
          <button onClick={onClose} className="job-modal__btn-close">
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
