const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizeText(inputText) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
        Summarize the following text into 3–5 concise bullet points.
        Return it as a JSON array like:
        [ "Point 1", "Point 2", "Point 3" ]

        TEXT: ${inputText}
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

module.exports = summarizeText;
