import crypto from "crypto";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import { PDFDocument } from "pdf-lib";
import axios from "axios";
import fs from "fs";
import { exec } from "child_process";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createWorker } from "tesseract.js";
import path from "path";
import { UserModel } from "../Models/userModel.js";
import Resume from "../Models/resumeModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import latex from "node-latex";
import { Readable } from "stream";
import OpenAI from "openai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ========================================== SKILS DICTIONARY ==========================================

const skillsDictionaryPath = path.join(
  process.cwd(),
  "Utilities",
  "skills.json",
);
const skillsDictionary = JSON.parse(
  fs.readFileSync(skillsDictionaryPath, "utf8"),
);

console.log("Skills dictionary imported successfully");

// ========================================== AUTH CONTROLLERS ===========================================

const register = async (req, res) => {
  try {
    const { username, password, phoneNumber, emailID } = req.body;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      phoneNumber,
      emailID,
    });

    const token = jwt.sign({ userID: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.status(httpStatus.CREATED).json({
      message: "User registered successfully",
      token,
      username: newUser.username,
    });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token, username });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Login failed" });
  }
};

// ========================================== PDF PROCESSING ==========================================

export async function isTextPDF(pdfBuffer) {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();

    let textScore = 0;
    let imageScore = 0;

    for (const page of pages) {
      const resources = page.node.Resources();
      const fonts = resources?.Fonts ? Object.keys(resources.Fonts) : [];
      const xObjects = resources?.XObject ? Object.keys(resources.XObject) : [];

      if (fonts.length > 0) textScore += 2;
      if (xObjects.length > 0) imageScore += 1;
    }

    const parsed = await pdf(pdfBuffer);
    const meaningfulText = parsed.text.replace(/\s+/g, "").length;

    return textScore >= imageScore && meaningfulText > 300;
  } catch (error) {
    console.error("PDF type detection failed:", error.message);
    return false;
  }
}

export async function extractTextFromPDF(pdfBuffer) {
  const data = await pdf(pdfBuffer);
  return data.text || "";
}

export async function extractTextFromOCR(pdfBuffer) {
  const timestamp = Date.now();
  const baseTempDir = path.join(process.cwd(), "Backend", "Temp");
  const pdfDir = path.join(baseTempDir, "pdfs");
  const imgDir = path.join(baseTempDir, "images");

  fs.mkdirSync(pdfDir, { recursive: true });
  fs.mkdirSync(imgDir, { recursive: true });

  const pdfPath = path.join(pdfDir, `resume-${timestamp}.pdf`);
  const imagePrefix = path.join(imgDir, `page-${timestamp}`);

  fs.writeFileSync(pdfPath, pdfBuffer);

  await new Promise((resolve, reject) => {
    exec(`pdftoppm -png "${pdfPath}" "${imagePrefix}"`, (err) =>
      err ? reject(err) : resolve(),
    );
  });

  const worker = await createWorker("eng");

  const images = fs
    .readdirSync(imgDir)
    .filter((f) => f.startsWith(`page-${timestamp}`))
    .sort();

  let finalText = "";

  for (const img of images) {
    const { data } = await worker.recognize(path.join(imgDir, img));
    finalText += data.text + "\n";
    fs.unlinkSync(path.join(imgDir, img));
  }

  await worker.terminate();
  fs.unlinkSync(pdfPath);

  return finalText.trim();
}

export async function processPDF(pdfBuffer) {
  return (await isTextPDF(pdfBuffer))
    ? extractTextFromPDF(pdfBuffer)
    : extractTextFromOCR(pdfBuffer);
}

// ========================================== ATS LOGIC ==========================================

// Normalize text
function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract skills
function extractSkills(resumeText, skillsDictionary) {
  const foundSkills = {};

  for (const category in skillsDictionary) {
    foundSkills[category] = [];

    for (const skill of skillsDictionary[category]) {
      const normalizedSkill = skill.toLowerCase();
      if (resumeText.includes(normalizedSkill)) {
        foundSkills[category].push(skill);
      }
    }
  }
  return foundSkills;
}

// Resume structure
function analyzeResumeStructure(text) {
  const sections = {
    experience: /experience|work experience/.test(text),
    education: /education/.test(text),
    skills: /skills/.test(text),
    projects: /projects/.test(text),
  };

  return (
    Object.values(sections).filter(Boolean).length /
    Object.keys(sections).length
  );
}

// Action verbs
function analyzeActionVerbs(text) {
  const ACTION_VERBS = [
    "developed",
    "built",
    "designed",
    "implemented",
    "led",
    "optimized",
    "created",
    "managed",
  ];

  let count = 0;
  for (const verb of ACTION_VERBS) {
    if (text.includes(verb)) count++;
  }

  return Math.min(count / 10, 1);
}

// Keyword density
function calculateKeyWordDensityScore(text) {
  const words = text.split(" ");
  const uniqueWords = new Set(words);
  return Math.min(uniqueWords.size / words.length, 1);
}

// ATS WITHOUT JD
function ATSWithoutJD(text) {
  const normalizedText = normalizeText(text);

  const skills = extractSkills(normalizedText, skillsDictionary);
  const totalSkills = Object.values(skills).flat().length;

  const structureScore = analyzeResumeStructure(normalizedText);
  const actionVerbScore = analyzeActionVerbs(normalizedText);
  const keywordScore = calculateKeyWordDensityScore(normalizedText);
  const skillScore = Math.min(totalSkills / 10, 1);

  const ATS_Score =
    skillScore * 0.4 +
    structureScore * 0.25 +
    actionVerbScore * 0.2 +
    keywordScore * 0.15;

  return {
    ATS_Score,
    breakdown: {
      skillScore,
      structureScore,
      actionVerbScore,
      keywordScore,
    },
  };
}

// ========================================== ATS WITH JD ==========================================

function extractJDKeywords(jd) {
  return Array.from(
    new Set(
      normalizeText(jd)
        .split(" ")
        .filter((w) => w.length > 3),
    ),
  );
}

function matchJDAndResume(resumeText, jdKeywords) {
  let matchCount = 0;

  for (const keyword of jdKeywords) {
    if (resumeText.includes(keyword)) {
      matchCount++;
    }
  }
  return jdKeywords.length ? matchCount / jdKeywords.length : 0;
}

function ATSWithJD(extractedText, jd) {
  const normalizedText = normalizeText(extractedText);
  const jdKeywords = extractJDKeywords(jd);

  const JDMatchScore = matchJDAndResume(normalizedText, jdKeywords);
  const structureScore = analyzeResumeStructure(normalizedText);
  const actionVerbScore = analyzeActionVerbs(normalizedText);

  const ATS_Score =
    JDMatchScore * 0.5 + structureScore * 0.25 + actionVerbScore * 0.25;

  return {
    ATS_Score,
    breakdown: {
      JDMatchScore,
      structureScore,
      actionVerbScore,
    },
  };
}

// Master ATS function
function calculateATS_Score({ extractedText, jd = "" }) {
  return jd != "" ? ATSWithJD(extractedText, jd) : ATSWithoutJD(extractedText); // consider empty string as no JD
}

// ========================================== RESUME UPLOAD ==========================================

const handleResumeUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdfBuffer = req.file.buffer;
    const jd = req.body.jd;

    // Detect PDF type
    const isText = await isTextPDF(pdfBuffer);
    const pdfType = isText ? "TEXT" : "OCR";

    const extractedText = await processPDF(pdfBuffer);

    const ATS_Score = calculateATS_Score({
      extractedText,
      jd: req.body.jd || "", //  if JD is not available send empty string but not null
    });

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "uploaded_resumes",
          resource_type: "raw",
          format: "pdf",
          public_id: `resume_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(pdfBuffer);
    });

    const savedResume = await Resume.create({
      userID: req.userID,
      fileURL: uploadResult.secure_url,
      fileID: uploadResult.public_id,
      pdfType,
      extractedText,
      extractionStatus: "SUCCESS",
      atsScore: ATS_Score.ATS_Score,
      atsBreakdown: ATS_Score.breakdown,
      jd: jd ? jd : "",
      uploadTime: new Date(),
    });

    res.status(201).json({
      message: "Resume uploaded & processed successfully",
      resumeID: savedResume._id,
      ATS_Score,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Resume upload failed" });
  }
};

// ========================================== FETCH RESULT ==========================================

const fetchResumeResults = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Resume.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (doc.userID.toString() !== req.userID) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "Access denied" });
    }

    res.status(httpStatus.OK).json({
      message: "Document fetched successfully",
      pdfType: doc.pdfType,
      extractedText: doc.extractedText,
      extractionStatus: doc.extractionStatus,
      atsScore: doc.atsScore,
      atsBreakdown: doc.atsBreakdown,
      jd: doc.jd,
      breakdown: doc.breakdown,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching document",
    });
  }
};

// ========================================== AI ANALYSIS ==========================================

// Step 1 set up AI API key and function to chat with it

const geminiSetup = async (prompt) => {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Response fetched successfully from Gemini");
    return text;
  } catch (error) {
    console.log(
      "This error occured in the fetching the response from Gemini : ",
      error,
    );
    return "ERROR";
  }
};

const handleAIAnalysis = async (req, res) => {
  try {
    const { extractedText, JD } = req.body;

    // Add validation
    if (!extractedText) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Extracted text is required",
      });
    }

    console.log("Received extractedText length:", extractedText?.length);
    console.log("Received JD:", JD ? "Yes" : "No");

    let prompt = ``;
    if (JD) {
      prompt =
        process.env.JD_ANALYSIS_PROMPT +
        ` Here is the resume: ${extractedText} and here is the JD: ${JD}`;
    } else {
      prompt =
        process.env.GENERAL_ANALYSIS_PROMPT +
        ` Here is the resume: ${extractedText}`;
    }

    console.log("Sending prompt to Gemini...");
    const analysisReport = await geminiSetup(prompt);

    if (analysisReport === "ERROR") {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to generate analysis from AI",
      });
    }

    return res.status(httpStatus.OK).json({
      message: "Analysis report fetched successfully...",
      report: analysisReport,
    });
  } catch (error) {
    console.log(`This error occurred in fetching the response from AI:`, error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      // Fixed typo here
      message:
        "There was some error in connecting with the servers, please try again after a while...",
    });
  }
};

const handleAICodeGeneration = async (req, res) => {
  try {
    const { extractedText, JD } = req.body;

    // Validation
    if (!extractedText) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Extracted text is required",
      });
    }

    let codingPrompt =
      process.env.CODING_PROMPT +
      `${
        JD ? ` Optimize it for this job description: ${JD}` : ""
      } Resume content: ${extractedText}`;

    console.log("Generating code with Gemini...");
    let code = await geminiSetup(codingPrompt);

    if (code === "ERROR") {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to generate code from AI",
      });
    }

    return res
      .status(httpStatus.OK)
      .json({ message: "Code fetched successfully...", code: code });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "There was some internal server error in fetching the response",
    });
  }
};

// ========================================== Latex code compilation ==========================================

const handleLatexCompilation = async (req, res) => {
  let { latexCode } = req.body;

  if (!latexCode) {
    return res.status(404).json({ message: "No latex code was found" });
  }

  try {
    console.log("=== LaTeX Compilation Started ===");
    console.log("LaTeX code length:", latexCode.length);

    // removing the markdown fences given by gemini
    if (latexCode.startsWith("```latex") || latexCode.startsWith("```")) {
      console.log("Removing markdown code fences...");
      latexCode = latexCode
        .replace(/^```latex\s*/i, "") // Remove opening ```latex
        .replace(/^```\s*/i, "") // Remove opening ```
        .replace(/\s*```\s*$/i, ""); // Remove closing ```
    }
    latexCode = latexCode.trim();

    // Create readable stream
    // const input = Readable.from([latexCode]);

    // Compile with more detailed error handling
    const pdf = latex(latexCode, {
      cmd: "pdflatex",
      passes: 2,
      errorLogs: process.cwd() + "/latex-compilation-errors.log",
    });

    // Set headers
    res.contentType("application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=resume.pdf");

    // Handle errors BEFORE piping
    pdf.on("error", (error) => {
      console.error("=== LaTeX Compilation Error ===");
      console.error("Error type:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // Try to read error log file
      try {
        const fs = require("fs");
        const errorLog = fs.readFileSync(
          process.cwd() + "/latex-compilation-errors.log",
          "utf8",
        );
        console.error("LaTeX Error Log:", errorLog);
      } catch (logError) {
        console.error("Could not read error log:", logError.message);
      }

      if (!res.headersSent) {
        return res.status(500).json({
          message: "LaTeX compilation failed",
          error: error.message,
        });
      }
    });

    // Handle successful finish
    pdf.on("finish", () => {
      console.log("PDF generated successfully");
    });

    // Pipe to response
    pdf.pipe(res);
  } catch (error) {
    console.error("=== Caught Exception ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ========================================== Further chatting with AI ==========================================

const handleChatting = async (req, res) => {
  try {
    const { latexCode, instructions } = req.body;
    const prompt = `${process.env.CHATTING_PROMPT}

    ===== EXISTING LATEX CODE (DO NOT MODIFY UNLESS INSTRUCTED) =====
    ${latexCode}
    ===== END OF EXISTING CODE =====

    ===== USER INSTRUCTION (APPLY THIS CHANGE ONLY) =====
    ${instructions}
    ===== END OF INSTRUCTION =====

    FINAL REMINDER: Return the FULL CODE document. Do not just return the changed lines. Do not return markdown.`;

    let response = await geminiSetup(prompt);
    if (response === "ERROR") {
      return res
        .status(500)
        .json({
          message:
            "There was some error in getting the code from AI. Please try again later",
        });
    }

    // Clean up the response
    response = response.trim();
    if (response.startsWith("```latex") || response.startsWith("```")) {
      response = response
        .replace(/^```latex\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```\s*$/i, "");
    }

    return res.status(httpStatus.OK).json({
      message: "Refined code fetched successfully....",
      code: response,
    });
  } catch (error) {
    console.log("Error in handleChatting:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({
        message:
          "There was some internal server error on our side. Please try again after some time...",
      });
  }
};

export {
  register,
  login,
  handleResumeUpload,
  fetchResumeResults,
  handleAIAnalysis,
  handleAICodeGeneration,
  handleLatexCompilation,
  handleChatting,
};
