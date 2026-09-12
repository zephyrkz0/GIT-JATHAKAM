const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

async function generateJoke(username, language, facts) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Load reference jokes
    let allReferences = { en: [], ml: [] };
    try {
        allReferences = require('../prompts/references.json');
    } catch (e) {
        console.warn('Failed to load references.json, continuing without references.');
    }
    const langReferences = allReferences[language] || allReferences['en'];
    const referenceJokesStr = langReferences.join('\n');

    // Build the facts string
    const factsStr = facts.map(f => `- ${f.instruction}`).join('\n');

    const persona = `You are an elite comedy writer and expert in Kerala-style astrology (Jyothisham).
Your goal is to roast the user's GitHub commit habits by turning them into an astrology reading (Jaathakam).
Use a sarcastic, mystical tone.

Target Language: ${language === 'ml' ? 'Malayalam (Code-mixed with English for technical terms, using Malayalam script)' : 'English with Indian astrology flavor'}.

Facts to include in this reading:
${factsStr}

Style Guidelines:
- Write ONE single cohesive paragraph tying these facts together.
- Use the reference jokes below for inspiration, but do NOT just copy-paste them. Blend the facts into an original roast in that same style!
- The reading must feel like an authentic Kerala Jyothishyan delivering a brutal verdict on their coding life.
- DO NOT output any preamble like "Here is your joke" or any english translation. Just give the raw roast output.

Reference Examples of the tone:
${referenceJokesStr}
`;

    const prompt = `Write the GitHub Jaathakam reading for user: ${username}`;

    try {
        console.log(`[Gemini] Generating Jaathakam with model: gemini-3.6-flash for user: ${username}`);
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [
                { role: 'user', parts: [{ text: persona + '\n\n' + prompt }] }
            ]
        });

        return response.text;
    } catch (error) {
        console.error('Gemini generation error:', error);
        throw new Error('Failed to consult the stars (Gemini LLM Error)');
    }
}

module.exports = {
    generateJoke
};
