import { Types } from 'mongoose';

export class VerificationEntity {
  private id?: string;
  private candidateId: Types.ObjectId | string;
  private isVerified: boolean;
  private name?: string;
  private age?: string;
  private phone?: string;
  private email?: string;
  private githubStars: number;
  private topLanguages: string[];
  private school?: string;
  private probedProjects?: any;
  private aiReasoning?: string;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(data: any) {
    this.id = data.id;
    this.candidateId = data.candidateId!;
    this.isVerified = data.isVerified ?? false;
    this.name = data.name;
    this.email = data.email;
    this.school = data.school;
    this.age = data.age;
    this.phone = data.phone;
    this.githubStars = data.githubStars ?? 0;
    this.topLanguages = data.topLanguages || [];
    this.probedProjects = data.probedProjects;
    this.aiReasoning = data.aiReasoning;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  public getId(): string | undefined { return this.id; }
  public setId(value: string | undefined): void { this.id = value; }

  public getCandidateId(): Types.ObjectId | string { return this.candidateId; }
  public setCandidateId(value: Types.ObjectId | string): void { this.candidateId = value; }

  public getIsVerified(): boolean { return this.isVerified; }
  public setIsVerified(value: boolean): void { this.isVerified = value; }

  public getName(): string | undefined { return this.name; }
  public setName(value: string | undefined): void { this.name = value; }

  public getAge(): string | undefined { return this.age; }
  public setAge(value: string | undefined): void { this.age = value; }

  public getPhone(): string | undefined { return this.phone; }
  public setPhone(value: string | undefined): void { this.phone = value; }

  public getEmail(): string | undefined { return this.email; }
  public setEmail(value: string | undefined): void { this.email = value; }

  public getGithubStars(): number { return this.githubStars; }
  public setGithubStars(value: number): void { this.githubStars = value; }

  public getTopLanguages(): string[] { return this.topLanguages; }
  public setTopLanguages(value: string[]): void { this.topLanguages = value; }

  public getSchool(): string | undefined { return this.school; }
  public setSchool(value: string | undefined): void { this.school = value; }

  public getProbedProjects(): any { return this.probedProjects; }
  public setProbedProjects(value: any): void { this.probedProjects = value; }

  public getAiReasoning(): string | undefined { return this.aiReasoning; }
  public setAiReasoning(value: string | undefined): void { this.aiReasoning = value; }

  public getCreatedAt(): Date | undefined { return this.createdAt; }
  public setCreatedAt(value: Date | undefined): void { this.createdAt = value; }

  public getUpdatedAt(): Date | undefined { return this.updatedAt; }
  public setUpdatedAt(value: Date | undefined): void { this.updatedAt = value; }

  public isTopCandidate(): boolean {
    return this.githubStars > 100 && this.topLanguages.length >= 3;
  }

  getVericationDetail() : any {
    
  }
}
