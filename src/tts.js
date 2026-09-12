const axios = require('axios');

async function generateTTS(text, language) {
    if (!process.env.SARVAM_API_KEY) {
        console.warn('SARVAM_API_KEY is not set. Skipping TTS generation.');
        return null;
    }

    try {
        // Truncate text to 2500 chars (bulbul:v3 limit)
        const truncatedText = text.length > 2400 ? text.substring(0, 2400) + '...' : text;

        console.log(`TTS Request: ${truncatedText.length} chars, language: ${language}`);

        // Sarvam AI Text-to-Speech API (bulbul:v3)
        const response = await axios.post('https://api.sarvam.ai/text-to-speech', {
            text: truncatedText,
            language_code: language === 'ml' ? 'ml-IN' : 'en-IN',
            speaker: 'amit',
            pace: 1.15,
            speech_sample_rate: 22050,
            model: 'bulbul:v3',
            output_format: 'wav',
            temperature: 0.8
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-subscription-key': process.env.SARVAM_API_KEY
            },
            timeout: 30000
        });

        if (response.data && response.data.audios && response.data.audios.length > 0) {
            return `data:audio/wav;base64,${response.data.audios[0]}`;
        }

        return null;
    } catch (error) {
        console.error('Sarvam TTS API error:', JSON.stringify(error.response?.data || error.message));
        throw new Error('Failed to generate speech');
    }
}

module.exports = {
    generateTTS
};
