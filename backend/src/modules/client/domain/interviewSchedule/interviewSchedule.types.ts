export interface IInterviewScheduleProps {
  id: string;
  time: Date;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  address: string;
  candidateId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInterviewScheduleDetail {
  id: string;
  time: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  address: string;
  candidateId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
