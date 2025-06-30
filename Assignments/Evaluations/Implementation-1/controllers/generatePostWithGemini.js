const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generatePostWithGemini(platform, topic) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
        Generate a post for ${platform} about the topic: "${topic}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/^```(json)?\s*|```\s*$/g, '').trim();
    try {
        return JSON.parse(cleanedText);
    } catch (err) {
        return { error: "Could not parse JSON", raw: cleanedText };
    }
}

module.exports = generatePostWithGemini;

