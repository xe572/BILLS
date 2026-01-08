
import { GoogleGenAI } from "@google/genai";
import { Bill } from "../types";

export const getFinancialInsights = async (bills: Bill[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const billsSummary = bills.slice(0, 50).map(b => `${b.date}: ${b.type} ${b.category} ${b.amount}`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `基于以下记账数据，用两句话给用户提供理财建议，语气要亲切幽默：\n${billsSummary}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "记账是一场马拉松，坚持就是胜利！";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "理财小助手暂时休息了，记得合理消费哦。";
  }
};
