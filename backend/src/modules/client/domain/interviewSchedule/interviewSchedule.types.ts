export interface IInterviewScheduleProps {
  id: string;
  time: Date;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | undefined;
  address: string;
  candidateId: string;
  userId: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface IInterviewScheduleDetail {
  id: string;
  time: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  address: string;
  candidateId: string;
  userId: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}
