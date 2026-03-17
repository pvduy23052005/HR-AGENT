"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedInService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GOOGLE_CSE_API_KEY = process.env.GOOGLE_CSE_API_KEY || '';
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID || '';
const GOOGLE_CSE_URL = 'https://www.googleapis.com/customsearch/v1';
/**
 * Parse name, title, company from Google CSE snippet/title for LinkedIn results.
 * Typical LinkedIn title format: "Name - Title at Company | LinkedIn"
 */
const parseLinkedInTitle = (title) => {
    // Remove LinkedIn suffix
    const cleaned = title.replace(/\s*[\|–-]\s*LinkedIn.*$/i, '').trim();
    // "Name - Title at Company" or "Name | Title"
    const dashIdx = cleaned.indexOf(' - ');
    if (dashIdx !== -1) {
        const name = cleaned.slice(0, dashIdx).trim();
        const rest = cleaned.slice(dashIdx + 3).trim();
        const atIdx = rest.toLowerCase().lastIndexOf(' at ');
        if (atIdx !== -1) {
            return { name, jobTitle: rest.slice(0, atIdx).trim(), company: rest.slice(atIdx + 4).trim() };
        }
        return { name, jobTitle: rest, company: '' };
    }
    return { name: cleaned, jobTitle: '', company: '' };
};
/**
 * Extract skills/keywords from snippet text (simple word extraction)
 */
const extractSkillsFromSnippet = (snippet, keywords) => {
    const techKeywords = keywords
        .split(/[\s,]+/)
        .map((k) => k.trim())
        .filter((k) => k.length > 2);
    const found = techKeywords.filter((k) => snippet.toLowerCase().includes(k.toLowerCase()));
    return [...new Set(found)].slice(0, 6);
};
class LinkedInService {
    /**
     * Search LinkedIn profiles via Google Custom Search Engine.
     * Returns profile URLs and parsed metadata from CSE snippet/title.
     * Does NOT scrape LinkedIn directly (respects ToS).
     */
    async searchCandidates(keywords, limit = 10) {
        if (!GOOGLE_CSE_API_KEY || !GOOGLE_CSE_ID) {
            console.warn('[LinkedIn] GOOGLE_CSE_API_KEY or GOOGLE_CSE_ID not configured. Skipping LinkedIn sourcing.');
            return [];
        }
        const q = `site:linkedin.com/in/ ${keywords}`;
        const { data } = await axios_1.default.get(GOOGLE_CSE_URL, {
            params: {
                key: GOOGLE_CSE_API_KEY,
                cx: GOOGLE_CSE_ID,
                q,
                num: Math.min(limit, 10), // Google CSE max 10 per request
            },
            timeout: 10000,
        });
        const items = data.items || [];
        return items.map((item) => {
            const { name, jobTitle, company } = parseLinkedInTitle(item.title || '');
            const snippet = item.snippet || '';
            const skills = extractSkillsFromSnippet(snippet, keywords);
            return {
                source: 'linkedin',
                name: name || 'Unknown',
                profileUrl: item.link || '',
                avatarUrl: item.pagemap?.cse_image?.[0]?.src || '',
                bio: snippet,
                location: item.pagemap?.metatags?.[0]?.['og:locale']?.replace('_', ' ') || '',
                topSkills: skills,
                jobTitle,
                company,
                email: '',
                githubRepos: 0,
                githubStars: 0,
            };
        });
    }
}
exports.LinkedInService = LinkedInService;
//# sourceMappingURL=linkedin.service.js.map