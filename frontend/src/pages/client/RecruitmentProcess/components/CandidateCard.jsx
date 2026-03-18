import React from 'react';

const CandidateCard = ({ candidate, onStatusChange }) => {
  const { id, candidateCode, name, position, status } = candidate;

  const handleSelectChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus !== status) {
      onStatusChange(id, newStatus);
    }
  };

  return (
    <div className="candidate-card">
      <div className="candidate-card__header">
        <span className="candidate-card__id">#{candidateCode}</span>
        <select 
          className="candidate-card__status-select"
          value={status}
          onChange={handleSelectChange}
        >
          <option value="applied">Ứng tuyển</option>
          <option value="screening">Sàng lọc</option>
          <option value="interview">Phỏng vấn</option>
          <option value="offer">Đề nghị</option>
        </select>
      </div>
      <h3 className="candidate-card__name">{name}</h3>
      <p className="candidate-card__position">{position}</p>
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
