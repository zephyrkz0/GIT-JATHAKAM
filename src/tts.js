const axios = require('axios');

async function generateTTS(text, language) {
    if (!process.env.SARVAM_API_KEY) {
        console.warn('SARVAM_API_KEY is not set. Skipping TTS generation.');
        return null; // Graceful fallback
    }

    try {
        // Sarvam AI Text-to-Speech API
        const response = await axios.post('https://api.sarvam.ai/text-to-speech', {
            inputs: [text],
            target_language_code: language === 'ml' ? 'ml-IN' : 'en-IN',
            speaker: 'meera', // 'meera' or another supported speaker from Sarvam
            pitch: 0,
            pace: 1.0,
            loudness: 1.5,
            speech_sample_rate: 8000,
            enable_preprocessing: true,
            model: 'bulbul:v1' // Specifically targeting the new bulbul model as requested
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-subscription-key': process.env.SARVAM_API_KEY
            }
        });

        // The response usually contains the audios as base64 strings
        if (response.data && response.data.audios && response.data.audios.length > 0) {
            // Return base64 audio string to be played on frontend
            return `data:audio/wav;base64,${response.data.audios[0]}`;
        }

        return null;
    } catch (error) {
        console.error('Sarvam TTS API error:', error.response?.data || error.message);
        throw new Error('Failed to generate speech');
    }
}

module.exports = {
    generateTTS
};
