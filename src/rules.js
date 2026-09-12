function getAstrologyFacts(stats) {
    const facts = [];

    // Midnight ratio
    if (stats.midnight_pct > 20) {
        facts.push({
            type: 'midnight',
            theme: 'Shani (Saturn) affliction',
            instruction: `Mention Saturn and that they have ${stats.midnight_pct}% commits after midnight. Shani has revoked their sleep.`
        });
    }

    // Weekend ratio
    if (stats.weekend_pct > 20) {
        facts.push({
            type: 'weekend',
            theme: 'Rahu-Ketu weekend axis',
            instruction: `Mention that ${stats.weekend_pct}% of commits are on weekends. Family thinks they have a job, GitHub thinks they have a problem.`
        });
    }

    // Message chaos
    if (stats.chaosCount >= 3) {
        facts.push({
            type: 'chaos',
            theme: 'Communication dosham',
            instruction: `Nod to the low-effort commit patterns ('fix', 'update'). This is a cry for help.`
        });
    }

    // Silence gap
    if (stats.gap_days >= 14) {
        facts.push({
            type: 'gap',
            theme: 'Vanavasam (exile period)',
            instruction: `Mention their ${stats.gap_days}-day absence as Vanavasam. They were watching another episode.`
        });
    }

    // PR merge ratio
    if (stats.totalPRs > 0 && stats.merge_pct < 50) {
        facts.push({
            type: 'pr',
            theme: 'World rejects you',
            instruction: `Mention their PR merge ratio is only ${stats.merge_pct}%. The universe rejects their proposals.`
        });
    }

    // Generic Repos
    if (stats.genericRepoCount >= 2) {
        facts.push({
            type: 'repo',
            theme: 'Creative block dosham',
            instruction: `Mention they have ${stats.genericRepoCount} repositories with extremely generic names like 'test' or 'demo'.`
        });
    }

    // Always include a closer
    facts.push({
        type: 'closer',
        theme: 'Final prediction',
        instruction: `End with a final prediction that ties the facts together. They will ship the feature late, exactly as the stars intended.`
    });

    return facts;
}

module.exports = {
    getAstrologyFacts
};
