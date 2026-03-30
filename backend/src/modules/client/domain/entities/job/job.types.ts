export interface IJobSummary {
  id?: string;
  title: string;
  status: boolean;
  requirements: string[];
  createdAt: Date | undefined;
}

export interface IJobDetail extends IJobSummary {
  description: string;
  requirements: string[];
}

export interface IJobProps {
  id?: string;
  title?: string;
  userID: string;
  description?: string;
  requirements?: string[];
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
