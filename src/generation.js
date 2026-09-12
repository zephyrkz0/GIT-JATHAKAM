const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

async function generateJoke(username, language, facts) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Load reference jokes
    const referencesPath = path.join(__dirname, '../prompts/references.json');
    const allReferences = JSON.parse(fs.readFileSync(referencesPath, 'utf8'));
    const langReferences = allReferences[language] || allReferences['en'];
    const referenceJokesStr = langReferences.join('\n');

    // Build the facts string
    const factsStr = facts.map(f => `- ${f.instruction}`).join('\n');

    const persona = `You are an elite comedy writer and expert in Kerala-style astrology (Jyothisham).
Your goal is to roast the user's GitHub commit habits by turning them into an astrology reading (Jaathakam).
Use a sarcastic, mystical tone.

Target Language: ${language === 'ml' ? 'Malayalam (Code-mixed with English for technical terms)' : 'English with Indian astrology flavor'}.

Facts to include in this reading:
${factsStr}

Style Guidelines:
- Write ONE single cohesive paragraph or a few punchy lines tying these facts together.
- Do NOT reproduce any of the reference examples verbatim; write an original joke.
- The reading must feel like an authentic Kerala Jyothishyan delivering a brutal verdict on their coding life.
- Do not include preamble or postamble (like "Here is your joke:"). Just output the final roast.

Here are some reference examples for the exact tone and style:
${referenceJokesStr}
`;

    const prompt = `Write the GitHub Jaathakam reading for user: ${username}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: persona + '\n\n' + prompt }] }
            ]
        });

        return response.text;
    } catch (error) {
        console.error('Gemini generation error:', error);
        throw new Error('Failed to consult the stars (LLM Error)');
    }
}

module.exports = {
    generateJoke
};
