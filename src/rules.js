function getAstrologyFacts(stats, githubData) {
    const facts = [];

    // ---- Profile-based roasts ----
    if (githubData.userProfile) {
        const profile = githubData.userProfile;
        if (profile.bio) {
            facts.push({
                type: 'bio',
                theme: 'Self-description dosham',
                instruction: `Their GitHub bio says: "${profile.bio}". Roast them for this bio. Is this what they're showing the stars? Ithanu nashathilekkulla avarde "portfolio"?`
            });
        }
        if (profile.company) {
            facts.push({
                type: 'company',
                theme: 'Company graha',
                instruction: `They claim to work at "${profile.company}". Predict whether they'll get fired or promoted based on their commit patterns.`
            });
        }
        if (profile.followers < 5) {
            facts.push({
                type: 'followers',
                theme: 'Social dosham',
                instruction: `They have only ${profile.followers} followers. Even their own mother hasn't starred their repos.`
            });
        }
    }

    // ---- Repo-based roasts ----
    if (githubData.repoDetails && githubData.repoDetails.length > 0) {
        // Pick out the funniest/most roastable repo names
        const roastableRepos = githubData.repoDetails
            .filter(r => !r.isFork)
            .slice(0, 10)
            .map(r => {
                let desc = r.name;
                if (r.description) desc += ` ("${r.description}")`;
                return desc;
            });

        if (roastableRepos.length > 0) {
            facts.push({
                type: 'repos',
                theme: 'Repository nakshatra analysis',
                instruction: `Here are their repository names and descriptions. Roast specific repos by name. Ask "ith enthaavatham aanu kanichu veckkunne?" (what kind of offering is this?) or "ith nashathilekkanu ninte pook?" (is this what you're showing the stars?). Repos: ${roastableRepos.join(', ')}`
            });
        }
    }

    // ---- Language-based roasts ----
    if (githubData.languages && githubData.languages.length > 0) {
        facts.push({
            type: 'languages',
            theme: 'Programming graha alignment',
            instruction: `Their dominant programming languages are: ${githubData.languages.join(', ')}. Assign a graha (planet) to their main language and roast accordingly. JavaScript = Chevvai (Mars) dosham, Python = deceptive calm, etc.`
        });
    }

    // ---- Commit message roasts ----
    if (githubData.sampleMessages && githubData.sampleMessages.length > 0) {
        const worstMessages = githubData.sampleMessages.filter(m =>
            /^(fix|update|test|wip|\.|asdf|temp|idk|stuff|changes|commit|init|\.\.\.)/i.test(m) || m.length < 5
        );
        if (worstMessages.length > 0) {
            facts.push({
                type: 'messages',
                theme: 'Commit message paapam',
                instruction: `Their actual commit messages include: "${worstMessages.slice(0, 5).join('", "')}". Roast these specific messages brutally.`
            });
        }
    }

    // ---- Stat-based roasts ----
    // Midnight ratio
    if (stats.midnight_pct > 20) {
        facts.push({
            type: 'midnight',
            theme: 'Shani (Saturn) affliction',
            instruction: `${stats.midnight_pct}% of commits happen after midnight. Shani has revoked their sleep. They debug when Kerala sleeps.`
        });
    }

    // Weekend ratio
    if (stats.weekend_pct > 20) {
        facts.push({
            type: 'weekend',
            theme: 'Rahu-Ketu weekend axis',
            instruction: `${stats.weekend_pct}% of commits are on weekends. Family thinks they have a job. GitHub thinks they have a problem.`
        });
    }

    // Message chaos count
    if (stats.chaosCount >= 3) {
        facts.push({
            type: 'chaos',
            theme: 'Communication dosham',
            instruction: `They have ${stats.chaosCount} low-effort commit messages like 'fix', 'update', '.'. This is not version control, this is a cry for help.`
        });
    }

    // Longest silence gap
    if (stats.gap_days >= 14) {
        facts.push({
            type: 'gap',
            theme: 'Vanavasam (exile period)',
            instruction: `There is a ${stats.gap_days}-day gap in their commit history. This is their Vanavasam. They were "watching one more episode".`
        });
    }

    // PR merge ratio
    if (stats.totalPRs > 0 && stats.merge_pct < 50) {
        facts.push({
            type: 'pr',
            theme: 'World rejects you',
            instruction: `PR merge ratio is only ${stats.merge_pct}%. The universe and their reviewers reject them. Symbolic of their dating life.`
        });
    }

    // Generic Repos
    if (stats.genericRepoCount >= 2) {
        facts.push({
            type: 'repo_generic',
            theme: 'Creative block dosham',
            instruction: `They have ${stats.genericRepoCount} repositories with extremely generic names like 'test' or 'demo'. Zero creativity detected.`
        });
    }

    // Always include a closer
    facts.push({
        type: 'closer',
        theme: 'Final prediction',
        instruction: `End with a brutal final prediction about their career and coding future. They will ship the feature late, exactly as the stars intended.`
    });

    return facts;
}

module.exports = {
    getAstrologyFacts
};
