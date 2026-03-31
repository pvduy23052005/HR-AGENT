import type { IVerificationProps } from "./verification.type";

export class VerificationEntity {
  private id?: string;
  private candidateId: string;
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

  private constructor(data: IVerificationProps) {
    this.id = data.id;
    this.candidateId = data.candidateId;
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

  public static create(data: IVerificationProps): VerificationEntity {
    if (!data.candidateId) throw new Error('Domain Error: Thiếu candidateId');

    return new VerificationEntity({
      ...data,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  public static restore(data: IVerificationProps): VerificationEntity {
    return new VerificationEntity(data);
  }

  public getDetail(): IVerificationProps {
    return {
      id: this.id,
      candidateId: this.candidateId,
      isVerified: this.isVerified,
      name: this.name,
      age: this.age,
      phone: this.phone,
      email: this.email,
      githubStars: this.githubStars,
      topLanguages: [...this.topLanguages],
      school: this.school,
      probedProjects: this.probedProjects,
      aiReasoning: this.aiReasoning,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public markAsVerified(aiReasoning?: string): void {
    this.isVerified = true;
    if (aiReasoning) this.aiReasoning = aiReasoning;
    this.updatedAt = new Date();
  }
}