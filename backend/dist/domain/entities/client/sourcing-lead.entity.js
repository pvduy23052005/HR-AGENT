"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourcingLeadEntity = void 0;
class SourcingLeadEntity {
    id;
    source;
    name;
    profileUrl;
    avatarUrl;
    bio;
    location;
    topSkills;
    jobTitle;
    company;
    email;
    githubRepos;
    githubStars;
    searchKeywords;
    jobID;
    status;
    createdAt;
    updatedAt;
    constructor({ id, source, name, profileUrl, avatarUrl = '', bio = '', location = '', topSkills = [], jobTitle = '', company = '', email = '', githubRepos = 0, githubStars = 0, searchKeywords, jobID, status = 'new', createdAt, updatedAt, }) {
        this.id = id ? id.toString() : null;
        this.source = source;
        this.name = name;
        this.profileUrl = profileUrl;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.location = location;
        this.topSkills = topSkills;
        this.jobTitle = jobTitle;
        this.company = company;
        this.email = email;
        this.githubRepos = githubRepos;
        this.githubStars = githubStars;
        this.searchKeywords = searchKeywords;
        this.jobID = jobID ? jobID.toString() : null;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getSummary() {
        return {
            id: this.id,
            source: this.source,
            name: this.name,
            profileUrl: this.profileUrl,
            avatarUrl: this.avatarUrl,
            bio: this.bio,
            location: this.location,
            topSkills: this.topSkills,
            jobTitle: this.jobTitle,
            company: this.company,
            email: this.email,
            githubRepos: this.githubRepos,
            githubStars: this.githubStars,
            searchKeywords: this.searchKeywords,
            jobID: this.jobID,
            status: this.status,
            createdAt: this.createdAt,
        };
    }
}
exports.SourcingLeadEntity = SourcingLeadEntity;
//# sourceMappingURL=sourcing-lead.entity.js.map