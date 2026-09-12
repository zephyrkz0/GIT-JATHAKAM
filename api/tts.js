const { generateTTS } = require('../src/tts');

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
        const { text, language = 'en' } = req.body || {};
        if (!text) {
            return res.status(400).json({ error: 'Text is required for TTS' });
        }

        const audioPayload = await generateTTS(text, language);
        return res.status(200).json({ audio: audioPayload });
    } catch (error) {
        console.error('TTS Generation failed:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate speech.' });
    }
};
