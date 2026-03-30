import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

const headers: Record<string, string> = {
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
if (GITHUB_TOKEN) {
  headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
}

export interface IGithubUserResult {
  source: 'github';
  name: string;
  profileUrl: string;
  avatarUrl: string;
  bio: string;
  location: string;
  topSkills: string[];
  email: string;
  company: string;
  githubRepos: number;
  githubStars: number;
  jobTitle: string;
}

/**
 * Fetch top repos of a user and return languages used
 */
const getUserTopLanguages = async (username: string, topN = 5): Promise<string[]> => {
  try {
    const { data: repos } = await axios.get(`${GITHUB_API}/users/${username}/repos`, {
      headers,
      params: { sort: 'stars', direction: 'desc', per_page: 10 },
      timeout: 8000,
    });

    const langCount: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + (repo.stargazers_count || 1);
      }
    }
    return Object.entries(langCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, topN)
      .map(([lang]) => lang);
  } catch {
    return [];
  }
};

/**
 * Get total stars of a user across all public repos
 */
const getUserTotalStars = async (username: string): Promise<number> => {
  try {
    const { data: repos } = await axios.get(`${GITHUB_API}/users/${username}/repos`, {
      headers,
      params: { per_page: 100 },
      timeout: 8000,
    });
    return repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
  } catch {
    return 0;
  }
};

export class GithubService {
  /**
   * Search GitHub users by keywords and enrich with profile details
   */
  async searchCandidates(keywords: string, limit = 10): Promise<IGithubUserResult[]> {
    let q = keywords;
    
    // 1. Extract location: "Ho Chi Minh", "Vietnam", "HCM", "Hanoi", "Da Nang"
    const locationMatch = keywords.match(/(Ho Chi Minh|HCM|Hanoi|Da Nang|Vietnam)/i);
    let locationQuery = '';
    if (locationMatch) {
      q = q.replace(locationMatch[0], '').trim();
      locationQuery = `location:"${locationMatch[0]}"`;
    }

    // 2. Extract common job titles (phrases with spaces) to keep them intact
    const jobTitles = ['machine learning engineer', 'software engineer', 'data scientist', 'frontend developer', 'backend developer', 'fullstack engineer', 'devops', 'product manager'];
    const queryParts = [];
    
    for (const title of jobTitles) {
      const titleRegex = new RegExp(title, 'i');
      if (q.match(titleRegex)) {
        q = q.replace(titleRegex, '').trim();
        // Wrap the job title in quotes so GitHub searches for the exact phrase
        queryParts.push(`"${title}"`);
      }
    }

    // 3. Extract languages
    const langs = ['javascript', 'typescript', 'python', 'java', 'go', 'ruby', 'c++', 'c#', 'php', 'rust', 'react', 'node', 'vue', 'angular'];
    const parts = q.split(' ').filter(Boolean);
    
    for (const part of parts) {
      if (langs.includes(part.toLowerCase())) {
        queryParts.push(`language:${part}`);
      } else {
        queryParts.push(part);
      }
    }
    
    if (locationQuery) {
      queryParts.push(locationQuery);
    }
    
    const finalQuery = queryParts.join(' ').trim() || 'developer';

    const { data } = await axios.get(`${GITHUB_API}/search/users`, {
      headers,
      params: { q: finalQuery, per_page: Math.min(limit, 30) },
      timeout: 10000,
    });

    const users: any[] = data.items || [];

    // Enrich each user with detailed profile - run concurrently but limit concurrency
    const enriched = await Promise.allSettled(
      users.slice(0, limit).map(async (user: any): Promise<IGithubUserResult> => {
        const [profileRes, languages, totalStars] = await Promise.all([
          axios.get(`${GITHUB_API}/users/${user.login}`, { headers, timeout: 8000 }).catch(() => null),
          getUserTopLanguages(user.login),
          getUserTotalStars(user.login),
        ]);

        const profile = profileRes?.data || {};

        return {
          source: 'github',
          name: profile.name || user.login,
          profileUrl: user.html_url,
          avatarUrl: user.avatar_url || '',
          bio: profile.bio || '',
          location: profile.location || '',
          topSkills: languages,
          email: profile.email || '',
          company: (profile.company || '').replace('@', '').trim(),
          githubRepos: profile.public_repos || 0,
          githubStars: totalStars,
          jobTitle: profile.blog ? 'See profile' : '',
        };
      }),
    );

    return enriched
      .filter((r): r is PromiseFulfilledResult<IGithubUserResult> => r.status === 'fulfilled')
      .map((r) => r.value);
  }
}
