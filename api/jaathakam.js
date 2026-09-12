const { fetchGitHubData } = require('../src/github');
const { calculateStats } = require('../src/stats');
const { getAstrologyFacts } = require('../src/rules');
const { generateJoke } = require('../src/generation');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { username, language = 'en' } = req.body || {};

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        console.log(`[Vercel] Processing request for user: ${username}, language: ${language}`);

        const rawData = await fetchGitHubData(username);
        const stats = calculateStats(rawData);
        const facts = getAstrologyFacts(stats, rawData);
        const generatedText = await generateJoke(username, language, facts);

        return res.status(200).json({
            stats,
            text: generatedText
        });
    } catch (error) {
        console.error('Error generating Jaathakam:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate Jaathakam. The stars are clouded today.' });
    }
};
