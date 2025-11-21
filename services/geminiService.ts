import { GoogleGenAI } from "@google/genai";

// Initialize GenAI client with API key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeEnvironment = async (base64Image: string): Promise<string> => {
  try {
    // Generate description of surroundings using Gemini Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          // Prompt for concise navigation support
          {
            text: "You are an assistant for a visually impaired person. Analyze this image and describe the immediate environment. Focus on: 1. Layout (hallways, doors). 2. Obstacles (furniture, people, trip hazards). 3. Safety warnings. Keep it concise, under 30 words, and direct."
          }
        ]
      }
    });

    return response.text || "Unable to analyze environment.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error connecting to visual analysis service.";
  }
};

export const detectObstacles = async (base64Image: string): Promise<{hasObstacle: boolean, message: string}> => {
   try {
    // Request specific structured JSON for safety logic
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: 'Is there an immediate obstacle or danger in the path within 1-2 meters? Answer strictly in JSON format: { "hasObstacle": boolean, "message": string }.'
          }
        ]
      },
      // Enforce JSON response format
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (text) {
        // Parse and return the safety data
        return JSON.parse(text);
    }
    return { hasObstacle: false, message: "" };

  } catch (error) {
    console.error("Obstacle Detection Error:", error);
    return { hasObstacle: false, message: "" };
  }
}