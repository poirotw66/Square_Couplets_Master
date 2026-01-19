import { GoogleGenAI, Type } from "@google/genai";
import { DOUFANG_SYSTEM_PROMPT } from "../constants";

const getClient = (apiKey?: string) => {
  // Use user-provided key if available, otherwise fallback to env var
  const key = apiKey?.trim() || process.env.API_KEY;
  if (!key) {
    throw new Error("API Key is missing. Please click the Settings icon to configure your Gemini API Key.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const generateDoufangPrompt = async (userKeyword: string, apiKey?: string): Promise<{ blessingPhrase: string; imagePrompt: string }> => {
  const ai = getClient(apiKey);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User input keyword: 「${userKeyword}」`,
      config: {
        systemInstruction: DOUFANG_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blessingPhrase: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          },
          required: ["blessingPhrase", "imagePrompt"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text);
  } catch (e: any) {
    console.error("Prompt generation failed", e);
    if (e.status === 403 || e.message?.includes("403")) {
      throw new Error("Permission Denied (403) during text generation. Your API Key might be invalid or lacks access to 'gemini-3-flash-preview'.");
    }
    throw e;
  }
};

export const generateDoufangImage = async (prompt: string, apiKey?: string, model: string = 'gemini-2.5-flash-image'): Promise<string> => {
  const ai = getClient(apiKey);

  let config = {};
  if (model === 'gemini-3-pro-image-preview') {
    config = {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: config
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated in the response.");
  } catch (e: any) {
    console.error("Image generation failed", e);
    if (e.status === 403 || e.message?.includes("403")) {
      if (model === 'gemini-3-pro-image-preview') {
        throw new Error(`Permission Denied (403). The 'Pro' model requires a Paid API Key (Billing Enabled). Please switch to 'Flash' in Settings or use a key with billing.`);
      }
      throw new Error(`Permission Denied (403). Your API Key is invalid or does not have access to ${model}.`);
    }
    throw e;
  }
};