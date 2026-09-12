const axios = require('axios');

async function fetchGitHubData(username) {
    const token = process.env.GITHUB_TOKEN;
    const headers = token ? { Authorization: `token ${token}` } : {};

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sinceIso = sixMonthsAgo.toISOString();
    const sinceDate = sinceIso.split('T')[0];

    try {
        // 1. Fetch Repositories to analyze names and get active ones
        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=30`, { headers });
        const repos = reposResponse.data;
        
        const repoNames = repos.map(r => r.name);
        
        // 2. Fetch Commits from recently pushed repos (limit to 5 to avoid rate limits)
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

        // 3. Fetch PR Stats via Search API
        // Total PRs opened in the last 6 months
        const prSearchQuery = `author:${username} type:pr created:>${sinceDate}`;
        let totalPRs = 0;
        let mergedPRs = 0;
        
        try {
            const prSearchResponse = await axios.get(
                `https://api.github.com/search/issues?q=${encodeURIComponent(prSearchQuery)}`,
                { headers }
            );
            totalPRs = prSearchResponse.data.total_count;
            
            // Merged PRs
            const mergedSearchQuery = `author:${username} type:pr is:merged created:>${sinceDate}`;
            const mergedSearchResponse = await axios.get(
                `https://api.github.com/search/issues?q=${encodeURIComponent(mergedSearchQuery)}`,
                { headers }
            );
            mergedPRs = mergedSearchResponse.data.total_count;
        } catch (err) {
            console.error('Failed to fetch PR stats:', err.message);
        }

        return {
            username,
            repoNames,
            commits: allCommits.sort((a, b) => new Date(a.date) - new Date(b.date)), // chronologically
            totalPRs,
            mergedPRs
        };

    } catch (error) {
        console.error('GitHub API error:', error.response?.data || error.message);
        throw new Error('Failed to fetch data from GitHub');
    }
}

module.exports = {
    fetchGitHubData
};
