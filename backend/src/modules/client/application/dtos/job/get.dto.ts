export interface IJobOutputDto {
  id?: string;
  title: string;
  status: boolean;
  requirements: string[];
  description?: string;
  userID?: string;
  createdAt?: Date;
}
