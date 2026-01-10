import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function extractTextWithGemini(fileBuffer, fileName) {
  try {
    console.log("📄 Extracting text using Gemini 2.5 Flash-Lite...");

    const ext = path.extname(fileName).toLowerCase();

    if (ext === ".txt") {
      return fileBuffer.toString("utf-8");
    }

    // ====== DOCX SHOULD BE EXTRACTED WITHOUT GEMINI ======
    if (ext === ".docx") {
      const { extractRawText } = await import("mammoth");
      const { value } = await extractRawText({ buffer: fileBuffer });
      return value;
    }

    // ====== CONTINUE WITH GEMINI OCR ======
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    const prompt = `
Extract ALL readable text from the file.
Do NOT summarize.
Keep line breaks.
Return ONLY the raw text.
`;

    const fileData = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: getMimeType(fileName),
      },
    };

    const result = await model.generateContent([
      fileData,
      { text: prompt }
    ]);

    return result.response.text() || "";

  } catch (error) {
    console.error("❌ Gemini extraction failed:", error);
    throw error;
  }
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();

  if (ext === ".pdf") return "application/pdf";
  if (ext === ".txt") return "text/plain";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (ext === ".doc") return "application/msword";

  return "application/octet-stream";
}
