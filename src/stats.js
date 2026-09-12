function calculateStats(githubData) {
    const { commits, repoNames, totalPRs, mergedPRs } = githubData;

    let midnightCommits = 0;
    let weekendCommits = 0;
    let chaosCount = 0;
    let longestGapDays = 0;
    
    // Ratios and gaps
    const totalCommits = commits.length;
    
    if (totalCommits > 0) {
        let lastCommitDate = null;
        const chaosPatterns = /^(fix|fix2|final_fix|actual_final_fix|update|test|wip|\.)$/i;

        commits.forEach(commit => {
            const date = new Date(commit.date);
            const hours = date.getHours(); // Local time for simplicity, ideally we should know user's TZ
            const day = date.getDay();

            // Midnight ratio (between 00:00 and 04:59)
            if (hours >= 0 && hours < 5) {
                midnightCommits++;
            }

            // Weekend ratio (0 is Sunday, 6 is Saturday)
            if (day === 0 || day === 6) {
                weekendCommits++;
            }

            // Message chaos
            if (chaosPatterns.test(commit.message.trim())) {
                chaosCount++;
            }

            // Longest silence gap
            if (lastCommitDate) {
                const diffTime = Math.abs(date - lastCommitDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                if (diffDays > longestGapDays) {
                    longestGapDays = diffDays;
                }
            }
            lastCommitDate = date;
        });
    }

    const midnight_ratio = totalCommits > 0 ? (midnightCommits / totalCommits) * 100 : 0;
    const weekend_ratio = totalCommits > 0 ? (weekendCommits / totalCommits) * 100 : 0;
    const pr_merge_ratio = totalPRs > 0 ? (mergedPRs / totalPRs) * 100 : 0;

    // Generic Repo Analysis
    const genericPatterns = /^(test|demo|my-app|hello-world|todo-app|project|temp)$/i;
    const genericRepoCount = repoNames.filter(name => genericPatterns.test(name)).length;

    return {
        totalCommits,
        midnight_pct: Math.round(midnight_ratio),
        weekend_pct: Math.round(weekend_ratio),
        chaosCount,
        gap_days: longestGapDays,
        merge_pct: Math.round(pr_merge_ratio),
        totalPRs,
        genericRepoCount
    };
}

module.exports = {
    calculateStats
};
