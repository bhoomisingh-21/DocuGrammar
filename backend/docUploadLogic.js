import dotenv from "dotenv";
import path from "path";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { checkGrammar } from "./grammarCheckingLogic.js";
import { extractTextWithGemini } from "./geminiExtractor.js";

dotenv.config();

/* =====================================================
   Main Handler
===================================================== */

export async function checkGrammarFromFile(file) {
  try {
    console.log(`📂 Processing file: ${file.originalname}`);
    const ext = path.extname(file.originalname).toLowerCase();

    // 1. Extract Text
    const extractedText = await extractTextWithGemini(file.buffer, file.originalname);

    if (!extractedText?.trim()) {
      throw new Error("No readable text found in the document.");
    }

    // 2. Run Grammar Check
    const result = await checkGrammar(extractedText);
    const { correctedText, hasChanges } = result;

    // 3. Handle Output Buffer Generation
    let outputBuffer;
    let outputFileName = "corrected.txt";

    if (!hasChanges) {
      outputBuffer = file.buffer;
      outputFileName = file.originalname;
    } else if (ext === ".docx") {
      outputBuffer = await generateDocx(correctedText);
      outputFileName = "corrected.docx";
    } else if (ext === ".pdf") {
      outputBuffer = await generatePdf(correctedText);
      outputFileName = "corrected.pdf";
    } else {
      outputBuffer = Buffer.from(correctedText, "utf-8");
    }

    return buildResponse({
      noChanges: !hasChanges,
      extractedText,
      correctedText,
      fileBuffer: outputBuffer,
      fileName: outputFileName,
      result,
    });

  } catch (err) {
    console.error("❌ File processing error:", err);
    throw err;
  }
}

/* =====================================================
   Response Builder
===================================================== */

function buildResponse({ noChanges, extractedText, correctedText, fileBuffer, fileName, result }) {
  return {
    noChanges,
    originalText: extractedText,
    correctedText,
    fileBuffer,
    fileName,
    modernRewrite: result.modernRewrite,
    styleSuggestions: result.styleSuggestions,
    readabilitySuggestions: result.readabilitySuggestions,
    issues: result.issues,
    issueCount: result.issueCount,
    toneAnalysis: result.toneAnalysis || null,
    clarityFeatures: result.clarityFeatures,
    readabilityMetrics: result.readabilityMetrics,
  };
}

/* =====================================================
   Generators
===================================================== */

async function generateDocx(text) {
  const { Document, Packer, Paragraph } = await import("docx");
  const children = text.split(/\n+/).map((line) => new Paragraph(line));
  const doc = new Document({ sections: [{ children }] });
  return Packer.toBuffer(doc);
}

async function generatePdf(text) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = 16;
  const margin = 20;

  let page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();
  const maxWidth = width - margin * 2;
  let cursorY = height - 40;

  const wrapLine = (line) => {
    const words = line.split(" ");
    let lines = [], current = "";
    for (const word of words) {
      const test = current + word + " ";
      if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
        lines.push(current.trim());
        current = word + " ";
      } else {
        current = test;
      }
    }
    if (current.trim()) lines.push(current.trim());
    return lines;
  };

  for (const paragraph of text.split("\n")) {
    for (const line of wrapLine(paragraph)) {
      if (cursorY < 40) {
        page = pdfDoc.addPage([595, 842]);
        cursorY = height - 40;
      }
      page.drawText(line, { x: margin, y: cursorY, size: fontSize, font });
      cursorY -= lineHeight;
    }
    cursorY -= 8;
  }

  return Buffer.from(await pdfDoc.save());
}