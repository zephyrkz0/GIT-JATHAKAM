const axios = require('axios');

async function fetchGitHubData(username) {
    const token = process.env.GITHUB_TOKEN;
    const headers = token ? { Authorization: `token ${token}` } : {};

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sinceIso = sixMonthsAgo.toISOString();
    const sinceDate = sinceIso.split('T')[0];

    try {
        // 1. Fetch user profile (bio, company, name, location)
        const userResponse = await axios.get(`https://api.github.com/users/${username}`, { headers });
        const userProfile = {
            name: userResponse.data.name || username,
            bio: userResponse.data.bio || '',
            company: userResponse.data.company || '',
            location: userResponse.data.location || '',
            followers: userResponse.data.followers || 0,
            following: userResponse.data.following || 0,
            publicRepos: userResponse.data.public_repos || 0,
            createdAt: userResponse.data.created_at
        };

        // 2. Fetch ALL Repositories (up to 100) with names, descriptions, and languages
        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`, { headers });
        const repos = reposResponse.data;

        const repoDetails = repos.map(r => ({
            name: r.name,
            description: r.description || '',
            language: r.language || 'Unknown',
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0,
            isFork: r.fork
        }));

        const repoNames = repos.map(r => r.name);
        const repoDescriptions = repos.filter(r => r.description).map(r => `${r.name}: "${r.description}"`);
        const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];

        // 3. Fetch Commits from recently pushed repos (limit to 5 to avoid rate limits)
        let allCommits = [];
        const activeRepos = repos.filter(r => new Date(r.pushed_at) > sixMonthsAgo).slice(0, 5);

        for (const repo of activeRepos) {
            try {
                const commitsResponse = await axios.get(
                    `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?author=${username}&since=${sinceIso}&per_page=100`,
                    { headers }
                );
                const commitsData = commitsResponse.data.map(c => ({
                    message: c.commit.message,
                    date: c.commit.author.date
                }));
                allCommits = allCommits.concat(commitsData);
            } catch (err) {
                console.error(`Failed to fetch commits for ${repo.name}:`, err.message);
            }
        }

        // 4. Fetch PR Stats via Search API
        const prSearchQuery = `author:${username} type:pr created:>${sinceDate}`;
        let totalPRs = 0;
        let mergedPRs = 0;

        try {
            const prSearchResponse = await axios.get(
                `https://api.github.com/search/issues?q=${encodeURIComponent(prSearchQuery)}`,
                { headers }
            );
            totalPRs = prSearchResponse.data.total_count;

            const mergedSearchQuery = `author:${username} type:pr is:merged created:>${sinceDate}`;
            const mergedSearchResponse = await axios.get(
                `https://api.github.com/search/issues?q=${encodeURIComponent(mergedSearchQuery)}`,
                { headers }
            );
            mergedPRs = mergedSearchResponse.data.total_count;
        } catch (err) {
            console.error('Failed to fetch PR stats:', err.message);
        }

        // 5. Collect sample commit messages for roasting
        const sampleMessages = allCommits
            .map(c => c.message.split('\n')[0]) // first line only
            .slice(0, 20);

        return {
            username,
            userProfile,
            repoNames,
            repoDetails,
            repoDescriptions,
            languages,
            sampleMessages,
            commits: allCommits.sort((a, b) => new Date(a.date) - new Date(b.date)),
            totalPRs,
            mergedPRs
        };

    } catch (error) {
        console.error('GitHub API error:', error.response?.data || error.message);
        if (error.response?.status === 404) {
            throw new Error(`GitHub user '${username}' not found. Check the spelling!`);
        }
        if (error.response?.status === 403) {
            throw new Error('GitHub rate limit reached. Please try again shortly.');
        }
        throw new Error('Failed to fetch data from GitHub. The stars are clouded.');
    }
}

module.exports = {
    fetchGitHubData
};
