import React from 'react';
import CandidateCard from './CandidateCard';

const Column = ({ title, colorClass, candidates, onStatusChange }) => {
  return (
    <div className={`kanban-column ${colorClass}`}>
      <div className="kanban-column__header">
        <span className="kanban-column__title">{title}</span>
        <span className="kanban-column__count">{candidates.length}</span>
      </div>
      <div className="kanban-column__content">
        {candidates.map(candidate => (
          <CandidateCard 
            key={candidate.id} 
            candidate={candidate} 
            onStatusChange={onStatusChange} 
          />
        ))}
        {candidates.length === 0 && (
          <div style={{ textAlign: 'center', color: '#888', padding: '20px 0', fontSize: '14px' }}>
            Không có ứng viên
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
