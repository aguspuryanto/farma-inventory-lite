
import { GoogleGenAI, Type } from "@google/genai";
import { Medicine } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeStockDiscrepancy(medicine: Medicine, actual: number) {
  if (!process.env.API_KEY) return "AI analysis unavailable (Missing API Key)";

  const prompt = `
    Medicine: ${medicine.name}
    System Stock: ${medicine.systemStock} ${medicine.unit}
    Actual Stock: ${actual} ${medicine.unit}
    Discrepancy: ${actual - medicine.systemStock}

    Analyze this stock discrepancy for a pharmacy. Provide 2-3 bullet points on possible causes and recommendations for prevention.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to analyze discrepancy.";
  }
}

export async function suggestPurchaseOrder(medicines: Medicine[]) {
  if (!process.env.API_KEY) return null;

  const lowStock = medicines.filter(m => m.systemStock < 50);
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on this low stock list, suggest quantities to order for next month: ${JSON.stringify(lowStock)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            medicineId: { type: Type.STRING },
            suggestedQty: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["medicineId", "suggestedQty"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}
