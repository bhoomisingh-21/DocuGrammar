import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import connectDB from "./config/db.js"; // 1. IMPORT THE CONNECTION
import User from "./models/User.js"; // <--- 1. IMPORT THE USER MODEL
import Analysis from "./models/Analysis.js";

import { checkGrammar } from "./grammarCheckingLogic.js";
import { checkGrammarFromFile } from "./docUploadLogic.js";

dotenv.config();

const app = express();

// 2. CONNECT TO DATABASE BEFORE MIDDLEWARE
connectDB();

app.use(express.json());
app.use(cors());

// --- MULTER CONFIG ---
const upload = multer({ storage: multer.memoryStorage() });

// --- RESPONSE HELPER ---
// Standardizes the output so you don't repeat keys in every conditional
const formatResponse = (result, originalText = null) => ({
  noChanges: result.noChanges ?? !result.hasChanges ?? false,
  originalText: result.originalText || originalText,
  correctedText: result.correctedText,
  modernRewrite: result.modernRewrite,
  styleSuggestions: result.styleSuggestions || [],
  readabilitySuggestions: result.readabilitySuggestions || [],
  issues: result.issues || [],
  issueCount: result.issueCount || 0,
  toneAnalysis: result.toneAnalysis || null,
  clarityFeatures: result.clarityFeatures || null,
  readabilityMetrics: result.readabilityMetrics || null,
  fileBuffer: result.fileBuffer || null,
  fileName: result.fileName || null,
});

// --- ENDPOINT: /uploadFile ---
app.post("/uploadFile", upload.single("file"), async (req, res) => {
  try {
    const { text } = req.body;
    const file = req.file;

    if (!text && !file) {
      return res.status(400).json({ error: "Provide text or a file" });
    }

    let result;

    // Prioritize file processing if both exist, or handle individually
    if (file) {
      // Handles both "File Only" and "File + Text" logic
      result = await checkGrammarFromFile(file);
    } else {
      // Handles "Text Only"
      result = await checkGrammar(text);
    }

    return res.json(formatResponse(result, text));
    
  } catch (error) {
    console.error("❌ Analyze error:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});


// --- NEW ENDPOINT: Google Authentication ---
app.post("/api/auth/google", async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ googleId });

    if (user) {
      // User exists, return the user data
      return res.status(200).json({ success: true, message: "Login successful", user });
    }

    // 2. If user doesn't exist, create a new one
    user = await User.create({
      name,
      email,
      googleId,
      avatar,
    });

    res.status(201).json({ success: true, message: "Signup successful", user });
  } catch (error) {
    console.error("❌ Auth Error:", error);
    res.status(500).json({ success: false, error: "Authentication failed" });
  }
});

// UPDATED ROUTE: Saves EVERYTHING from the results page
app.post("/api/save-analysis", async (req, res) => {
  try {
    // We use the spread operator (...) to catch every key 
    // coming from your frontend (originalText, issues, clarityFeatures, etc.)
    const newEntry = new Analysis({
      ...req.body 
    });

    await newEntry.save();
    
    res.status(201).json({ message: "Full analysis session saved successfully!" });
  } catch (error) {
    console.error("Database Save Error:", error);
    res.status(500).json({ error: "Failed to save data to database" });
  }
});

// ADD THIS ROUTE TOO (You were missing the GET route in your server.js)
app.get("/api/user-history/:userId", async (req, res) => {
  try {
    const history = await Analysis.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});


// DELETE a specific analysis by ID
app.delete("/api/delete-analysis/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Analysis.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    res.status(200).json({ message: "Analysis deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Server failed to delete the record" });
  }
});




// --- START SERVER ---
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});