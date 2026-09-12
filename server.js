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

        // 5. TTS Integration (Bulbul model)
        let audioPayload = null;
        try {
            audioPayload = await generateTTS(generatedText, language);
        } catch (ttsError) {
            console.error('TTS Generation failed, falling back to text only:', ttsError);
        }

        // 6. Response
        res.json({
            stats,
            text: generatedText,
            audio: audioPayload
        });

    } catch (error) {
        console.error('Error generating Jaathakam:', error);
        res.status(500).json({ error: 'Failed to generate Jaathakam. The stars are clouded today.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
