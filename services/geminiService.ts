import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWorkerQuote = async (status: string, timeOfDay: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "老板在看着你。(API Key missing)";

  const prompt = `
    Role: You are a cynical, witty, and slightly dark-humored senior software engineer or office worker (a "Niu Ma" in Chinese internet slang).
    Task: Generate a short, punchy, one-sentence quote (maximum 30 words) in Chinese suitable for display on a clock app.
    Context:
    - Current Work Status: ${status}
    - Time of Day: ${timeOfDay}
    
    Guidelines:
    - If it's early morning, complain about coffee or waking up.
    - If it's work hours, make a joke about meetings, slack, or pretending to work.
    - If it's near the end of the day, talk about looking at the clock.
    - If it's overtime, be very cynical about capitalism or health.
    - If it's late night, tell the user to go to sleep.
    - Do NOT be overly positive. Be relatable and satirical.
    
    Output: Just the text string in Chinese. No quotation marks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "摸鱼一时爽，一直摸鱼一直爽。";
  } catch (error) {
    console.error("Error generating quote:", error);
    return "网络开小差了，就像你现在一样。";
  }
};