export interface ICreateJobInputDto {
  title: string;
  userID: string;
  description?: string | undefined;
  requirements?: string[] | undefined;
}

export interface IUpdateJobInputDto {
  title?: string | undefined;
  description?: string | undefined;
  requirements?: string[] | undefined;
  status?: boolean | undefined;
}
