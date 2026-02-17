
import { GoogleGenAI, Type } from "@google/genai";
import { Medicine } from "../types";

/**
 * Note: Following the @google/genai coding guidelines, we initialize
 * the GoogleGenAI instance right before making the API call.
 */

export async function analyzeStockDiscrepancy(medicine: Medicine, actual: number) {
  // Access API_KEY directly from environment
  if (!process.env.API_KEY) return "AI analysis unavailable (Missing API Key)";

  // Initialize client right before use
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Medicine: ${medicine.name}
    System Stock: ${medicine.systemStock} ${medicine.unit}
    Actual Stock: ${actual} ${medicine.unit}
    Discrepancy: ${actual - medicine.systemStock}

    Analyze this stock discrepancy for a pharmacy. Provide 2-3 bullet points on possible causes and recommendations for prevention.
  `;

  try {
    // Basic text task uses gemini-3-flash-preview
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Use .text property directly
    return response.text || "No analysis provided.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to analyze discrepancy.";
  }
}

export async function suggestPurchaseOrder(medicines: Medicine[]) {
  if (!process.env.API_KEY) return null;

  // Initialize client right before use
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const lowStock = medicines.filter(m => m.systemStock < 50);
  
  try {
    // Complex reasoning task - use gemini-3-pro-preview
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
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
            required: ["medicineId", "suggestedQty", "reasoning"]
          }
        }
      }
    });

    // Use .text property directly and trim
    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}
