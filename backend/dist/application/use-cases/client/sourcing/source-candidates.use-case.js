"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceCandidatesUseCase = void 0;
const github_service_1 = require("../../../../infrastructure/external-service/github.service");
const linkedin_service_1 = require("../../../../infrastructure/external-service/linkedin.service");
class SourceCandidatesUseCase {
    sourcingLeadRepo;
    githubService;
    linkedInService;
    constructor(sourcingLeadRepo) {
        this.sourcingLeadRepo = sourcingLeadRepo;
        this.githubService = new github_service_1.GithubService();
        this.linkedInService = new linkedin_service_1.LinkedInService();
    }
    async execute(input) {
        const { keywords, sources, limit = 10, jobID } = input;
        // Run sourcing in parallel for requested sources
        const tasks = [];
        if (sources.includes('github')) {
            tasks.push(this.githubService.searchCandidates(keywords, limit).catch((err) => {
                console.error('[SourceCandidates] GitHub error:', err?.message);
                return [];
            }));
        }
        else {
            tasks.push(Promise.resolve([]));
        }
        if (sources.includes('linkedin')) {
            tasks.push(this.linkedInService.searchCandidates(keywords, limit).catch((err) => {
                console.error('[SourceCandidates] LinkedIn error:', err?.message);
                return [];
            }));
        }
        else {
            tasks.push(Promise.resolve([]));
        }
        const [githubResults, linkedinResults] = await Promise.all(tasks);
        const allResults = [...githubResults, ...linkedinResults];
        // Save leads to DB (repository handles deduplication by profileUrl)
        const savedLeads = [];
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
            if (lead)
                savedLeads.push(lead);
        }
        return savedLeads;
    }
}
exports.SourceCandidatesUseCase = SourceCandidatesUseCase;
//# sourceMappingURL=source-candidates.use-case.js.map