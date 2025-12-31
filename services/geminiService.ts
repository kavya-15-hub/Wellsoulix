
import { GoogleGenAI } from "@google/genai";
import { AppMode, Attachment } from "../types";
import { MODE_CONFIGS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWellsoulixResponse = async (
  prompt: string,
  mode: AppMode,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  attachment?: Attachment
) => {
  const config = MODE_CONFIGS[mode];
  
  const systemInstruction = `
    You are Wellsoulix, an AI-powered student companion.
    Current Active Mode: ${mode}
    Tone Style: ${config.description}. Use ${config.color} vibes.
    
    SPECIAL FEATURE:
    The user might send attachments (Images, Links, or Docs). 
    - If it's an image, describe it briefly and relate it to your mode.
    - If it's a link, acknowledge it.
    - If it's a doc, help them organize or summarize if they ask.

    GENERAL RULES:
    1. ALWAYS start your reply with: "[Mode: ${mode}]"
    2. Keep responses short (2-4 sentences).
    3. Be friendly, supportive, and practical.
    4. Use emojis sparingly.
  `;

  try {
    const parts: any[] = [{ text: prompt }];

    // Handle multimodal attachment
    if (attachment && attachment.type === 'image') {
      parts.push({
        inlineData: {
          data: attachment.data.split(',')[1], // Strip the data:image/png;base64, prefix
          mimeType: attachment.mimeType || 'image/jpeg',
        },
      });
    } else if (attachment && (attachment.type === 'link' || attachment.type === 'doc')) {
      parts[0].text = `[Attachment: ${attachment.type} - ${attachment.data}] ${prompt}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: parts }
      ],
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "[Mode: Error] I'm having a little trouble connecting to the network. I'm still here for you 💜.";
  }
};
