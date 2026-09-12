const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { fetchGitHubData } = require('./src/github');
const { calculateStats } = require('./src/stats');
const { getAstrologyFacts } = require('./src/rules');
const { generateJoke } = require('./src/generation');
const { generateTTS } = require('./src/tts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/jaathakam', async (req, res) => {
    try {
        const { username, language = 'en' } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        console.log(`Processing request for user: ${username}, language: ${language}`);

        // 1. Fetch Raw Data (Last 6 months)
        const rawData = await fetchGitHubData(username);

        // 2. Stat Engine
        const stats = calculateStats(rawData);

        // 3. Rule Table
        const facts = getAstrologyFacts(stats);

        // 4. LLM Generation
        const generatedText = await generateJoke(username, language, facts);

        // 5. Response
        res.json({
            stats,
            text: generatedText
        });

    } catch (error) {
        console.error('Error generating Jaathakam:', error);
        res.status(500).json({ error: 'Failed to generate Jaathakam. The stars are clouded today.' });
    }
});

app.post('/tts', async (req, res) => {
    try {
        const { text, language = 'en' } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required for TTS' });
        }
        
        const audioPayload = await generateTTS(text, language);
        res.json({ audio: audioPayload });
    } catch (error) {
        console.error('TTS Generation failed:', error);
        res.status(500).json({ error: 'Failed to generate speech.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
