import { GoogleGenAI, Type } from "@google/genai";
import { Student, AIAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStudentPerformance = async (student: Student): Promise<AIAnalysisResult> => {
  try {
    const prompt = `
      Analyze the performance of this student based on their marks (out of 100 for each subject).
      Student Name: ${student.name}
      Marks: ${JSON.stringify(student.marks)}
      
      Provide:
      1. A brief summary of their overall performance.
      2. A list of key strengths.
      3. A list of weaknesses.
      4. A specific recommendation for improvement.
      
      Be professional, encouraging, but realistic.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING },
          },
          required: ["summary", "strengths", "weaknesses", "recommendation"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Error analyzing student:", error);
    return {
      summary: "Could not generate analysis at this time.",
      strengths: [],
      weaknesses: [],
      recommendation: "Please try again later."
    };
  }
};

export const generateMockData = async (): Promise<Student[]> => {
  try {
    const prompt = "Generate 5 fictitious student records with realistic marks (0-100) for Math, Science, English, History, and Programming. Provide unique IDs and roll numbers.";
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              rollNumber: { type: Type.STRING },
              email: { type: Type.STRING },
              marks: {
                type: Type.OBJECT,
                properties: {
                  math: { type: Type.NUMBER },
                  science: { type: Type.NUMBER },
                  english: { type: Type.NUMBER },
                  history: { type: Type.NUMBER },
                  programming: { type: Type.NUMBER }
                },
                required: ["math", "science", "english", "history", "programming"]
              }
            },
            required: ["id", "name", "rollNumber", "email", "marks"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Student[];
    }
    return [];
  } catch (e) {
    console.error("Failed to generate mock data", e);
    return [];
  }
}
