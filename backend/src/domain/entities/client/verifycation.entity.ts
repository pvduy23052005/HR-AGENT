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

  public isTopCandidate(): boolean {
    return this.githubStars > 100 && this.topLanguages.length >= 3;
  }
}