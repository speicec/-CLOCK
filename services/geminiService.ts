import { GoogleGenAI } from "@google/genai";

const FALLBACK_QUOTES = [
  "老板画的饼，太硬，咬不动。",
  "上班是为了下班，下班是为了第二天继续上班。",
  "打工人的怨气，足以养活十个邪剑仙。",
  "工资就像大姨妈，一个月来一次，一周就没了。",
  "只要我摸鱼够快，贫穷就追不上我。",
  "公司是家，工资是零花钱。",
  "不要大声责骂年轻人，他们会立刻辞职。但是你可以往死里骂中年人，他们有房贷车贷。",
  "努力不一定被看到，但摸鱼一定会被抓到。",
  "早八晚五，不如跳舞。",
  "今日搬砖不狠，明日地位不稳。",
  "万恶的资本主义，击碎了我的脊梁。",
  "只有在带薪拉屎的时候，我才觉得自己属于自己。",
  "别人的公司叫上市公司，我们的公司叫'挺住'公司。",
  "周一的早上，连路边的狗看着都眉清目秀。",
  "问：为什么西游记只有孙悟空一只猴子？答：因为其他的猴子在忙着996。",
  "我爱工作，工作使我快乐（面无表情）。",
  "摸鱼一时爽，一直摸鱼一直爽。",
  "不仅没留下遗产，还欠了花呗。",
  "别问我为什么还没睡，我在通往猝死的路上排队。",
  "我的耐心就像我的工资一样，少得可怜。"
];

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWorkerQuote = async (status: string, timeOfDay: string): Promise<string> => {
  const ai = getClient();
  
  // If no client (no API key), return a fallback immediately
  if (!ai) {
    return getRandomFallback();
  }

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
    return response.text?.trim() || getRandomFallback();
  } catch (error) {
    console.warn("Error generating quote (likely rate limit or network):", error);
    // Return a random fallback quote instead of a generic error message
    return getRandomFallback();
  }
};

const getRandomFallback = (): string => {
  const index = Math.floor(Math.random() * FALLBACK_QUOTES.length);
  return FALLBACK_QUOTES[index];
};