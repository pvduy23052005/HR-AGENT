import { GithubService } from '../../../../infrastructure/external-service/github.service';
import { LinkedInService } from '../../../../infrastructure/external-service/linkedin.service';
import type { ISourcingLeadWriteRepo } from '../../../../domain/interfaces/client/sourcing-lead.interface';
import type { SourcingLeadEntity, SourcingSource } from '../../../../domain/entities/client/sourcing-lead.entity';

export interface ISourceCandidatesInput {
  keywords: string;
  sources: SourcingSource[];
  limit?: number;
  jobID?: string;
}

export class SourceCandidatesUseCase {
  private githubService: GithubService;
  private linkedInService: LinkedInService;

  constructor(private readonly sourcingLeadRepo: ISourcingLeadWriteRepo) {
    this.githubService = new GithubService();
    this.linkedInService = new LinkedInService();
  }

  async execute(input: ISourceCandidatesInput): Promise<SourcingLeadEntity[]> {
    const { keywords, sources, limit = 10, jobID } = input;

    // Run sourcing in parallel for requested sources
    const tasks: Promise<any[]>[] = [];

    if (sources.includes('github')) {
      tasks.push(this.githubService.searchCandidates(keywords, limit).catch((err) => {
        console.error('[SourceCandidates] GitHub error:', err?.message);
        return [];
      }));
    } else {
      tasks.push(Promise.resolve([]));
    }

    if (sources.includes('linkedin')) {
      tasks.push(this.linkedInService.searchCandidates(keywords, limit).catch((err) => {
        console.error('[SourceCandidates] LinkedIn error:', err?.message);
        return [];
      }));
    } else {
      tasks.push(Promise.resolve([]));
    }

    const [githubResults, linkedinResults] = await Promise.all(tasks);
    const allResults = [...githubResults, ...linkedinResults];

    // Save leads to DB (repository handles deduplication by profileUrl)
    const savedLeads: SourcingLeadEntity[] = [];
    for (const result of allResults) {
      const lead = await this.sourcingLeadRepo.create({
        source: result.source,
        name: result.name,
        profileUrl: result.profileUrl,
        avatarUrl: result.avatarUrl,
        bio: result.bio,
        location: result.location,
        topSkills: result.topSkills,
        jobTitle: result.jobTitle,
        company: result.company,
        email: result.email,
        githubRepos: result.githubRepos ?? 0,
        githubStars: result.githubStars ?? 0,
        searchKeywords: keywords,
        jobID,
      });
      if (lead) savedLeads.push(lead);
    }

    return savedLeads;
  }
}
