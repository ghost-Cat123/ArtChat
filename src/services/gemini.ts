import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// 1. 使用 Vite 的方式读取环境变量
const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

if (!apiKey) {
  console.warn("VITE_DEEPSEEK_API_KEY is not set. 检查你的 .env 文件！");
}

export const ai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: apiKey || "",
  dangerouslyAllowBrowser: true // 允许纯前端调用
});

export async function getAIResponse(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const formattedHistory: ChatCompletionMessageParam[] = history.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts[0].text
    }));

    const response = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是一个高效、优雅且极简的个人AI助手。你的回答应该清晰、扼要且富有洞察力。你的设计理念是'少即是多'。你的名字叫'缪斯' (Muse)。"
        },
        ...formattedHistory,
        { role: "user", content: prompt }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    return "抱歉，我现在无法思考，请稍后再试。";
  }
}