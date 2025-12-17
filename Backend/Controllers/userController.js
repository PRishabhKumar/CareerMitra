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
import {GoogleGenerativeAI} from '@google/generative-ai'
import { createWorker } from "tesseract.js";
import path from "path";
import { UserModel } from "../Models/userModel.js";
import Resume from "../Models/resumeModel.js";
import cloudinary from "../config/cloudinaryConfig.js";


const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// ========================================== Skills Dictionary ==========================================

const skillsDictionaryPath = path.join(
  process.cwd(),
  "Utilities",
  "skills.json"
);
const skillsDictionary = JSON.parse(
  fs.readFileSync(skillsDictionaryPath, "utf8")
);

console.log("Skills dictionary imported successfully");

// ========================================== AUTH CONTROLLERS ==========================================

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
      expiresIn: "1d",
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
      err ? reject(err) : resolve()
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
        .filter((w) => w.length > 3)
    )
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
        }
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

// Step 1 set up Gemini API key and function to chat with it 

const geminiSetup = async (prompt)=>{
  try{
      const model = ai.getGenerativeModel({model: "gemini-2.5-flash"})
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text
      return res.status(httpStatus.OK).json({message: "Response fetched successfully from AI", 
        text
      })
  }
  catch(error){
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: "There was some internal server error in connecting with the AI"})
  }
}

const handleAIAnalysis = async(extractedText, JD)=>{
  try{
    let prompt = ``
    if(JD){
      prompt = `You are an expert ATS specialist and career consultant. Analyze this resume against the job     description and provide actionable feedback.
        **RESUME:**
        ${resumeText}
        **JOB DESCRIPTION:**
        ${jobDescription}
        **Provide analysis in this format:**
        **1. ATS SCORE & KEYWORD ANALYSIS (0-100)**
        - Overall score with brief justification
        - Critical missing keywords from JD
        - Keyword placement recommendations
        **2. SKILLS & EXPERIENCE GAP**
        - Required skills/qualifications missing or underrepresented
        - Experience misalignments with JD requirements
        **3. CONTENT ISSUES (with specific examples)**
        - Weak bullet points (list 3-5 with improvement suggestions)
        - Missing quantifiable achievements
        - Passive language or vague statements
        - Irrelevant information for this role
        **4. STRUCTURAL PROBLEMS**
        - Formatting inconsistencies
        - Missing or weak sections
        - Length issues
        **5. TOP 10 PRIORITY IMPROVEMENTS**
        Rank by impact (HIGH/MEDIUM/LOW priority):
        - Be specific and actionable
        - Tie each recommendation to JD requirements
        **6. COMPETITIVE EDGE**
        - Unique strengths to emphasize
        - How this resume compares to typical candidates
        Be direct and specific. Use examples from the resume. Focus on changes that improve JD match.`
      }
      else{
        prompt = `You are an expert resume writer with cross-industry knowledge. Conduct a comprehensive analysis to improve this resume.
        **RESUME:**
        ${resumeText}

        **Provide analysis in this format:**

        **1. FIRST IMPRESSION (6-Second Test)**
        - Overall professional presentation score (0-100)
        - Does it immediately highlight strongest qualifications?
        - Visual hierarchy and readability

        **2. STRUCTURE & FORMAT**
        - Section organization issues
        - Inconsistencies in formatting
        - Missing recommended sections
        - Appropriate length for experience level

        **3. CONTENT QUALITY ANALYSIS**
        Identify with examples:
        - 5 weakest bullet points → how to strengthen them
        - Missing quantifiable metrics (%, $, numbers, scale)
        - Weak action verbs → strong alternatives
        - Grammar/spelling/tense errors
        - Buzzwords without substance

        **4. SECTION EVALUATIONS**

        **Experience:**
        - Achievement vs responsibility ratio
        - STAR method usage
        - Career progression clarity

        **Skills:**
        - Organization and categorization
        - Outdated/irrelevant skills to remove
        - High-demand skills missing

        **Summary/Objective:**
        - Effectiveness assessment
        - Rewrite suggestion if weak/missing

        **5. ATS READINESS**
        - Format compatibility issues
        - Keyword density and variety
        - Section header standardization

        **6. WHAT'S MISSING**
        - Projects, certifications, awards
        - Relevant volunteer work or leadership
        - Industry-specific credentials

        **7. WHAT TO REMOVE**
        - Outdated or irrelevant information
        - Generic filler content

        **8. PRIORITIZED ACTION PLAN**

        **Immediate (High Impact):**
        5 critical changes

        **Secondary (Important):**
        5 valuable improvements

        **Polish:**
        3 final refinements

        **9. STRENGTHS TO MAINTAIN**
        - 3 strongest aspects of current resume
        - Unique selling points to preserve

        Be constructive, specific, and actionable. Include before/after examples.`
      }
    const analysisReport = await geminiSetup(prompt)
    return res.status(httpStatus.OK).json({message: "Analysis report fetched successfully...",
        report: analysisReport
      })
  }
  catch(error){
    console.log(`This error occured in fetching the response from AI : ${error}`)
    return res.status(httpsStatus.INTERNAL_SERVER_ERROR).json({message: "There was some error in connecting with the servers, please try again after a while..."})
  }
}

const handleAICodeGeneration = async(extractedText, JD)=>{
  try{
    let codingPrompt = `You are an expert resume writer and LaTeX developer. Create an optimized, ATS-friendly resume in LaTeX based on the analysis provided.
    **ORIGINAL RESUME:**
    ${resumeText}
    
    **IMPROVEMENTS TO IMPLEMENT:**
    ${analysisReport}
    
    **REQUIREMENTS:**
    
    **1. IMPLEMENT ALL ANALYSIS RECOMMENDATIONS**
    - Fix all identified issues
    - Strengthen weak bullet points with action verbs and metrics
    - Add missing sections and keywords naturally
    - Remove irrelevant content
    
    **2. LATEX SPECIFICATIONS**
    - Use \\documentclass[11pt,a4paper]{article}
    - Single-column layout (ATS-friendly)
    - Standard packages only: geometry, enumitem, hyperref, fontenc
    - No tables for layout, no graphics, no headers/footers
    - Standard section headers: EXPERIENCE, EDUCATION, SKILLS
    - Clean, parseable structure
    
    **3. CONTENT FORMULA**
    - Summary: 2-3 lines capturing key value and expertise
    - Experience bullets: Use "Accomplished [X] measured by [Y] by doing [Z]"
    - 3-5 bullets per role (more detail for recent positions)
    - Skills: Organized by category, most relevant first
    - Include both acronyms and full terms: "Machine Learning (ML)"
    
    **4. QUALITY STANDARDS**
    ✓ Strong action verbs (Led, Architected, Optimized, Increased)
    ✓ Quantifiable results in every bullet where possible
    ✓ Consistent tense (past for old roles, present for current)
    ✓ All special characters escaped (%, $, &, #)
    ✓ No placeholders - use actual content from original resume
    ✓ Professional, polished language
    ✓ Proper spacing and formatting
    
    **OUTPUT:**
    Return ONLY the complete LaTeX code wrapped in \`\`\`latex code block. No explanations. Ensure it compiles without errors and preserves all original information while implementing improvements.
    
    Generate the refined resume now:`
    let code = await geminiSetup(codingPrompt)
    return res.status(httpsStatus.OK).json({message: "Code fetched successfully...",
      code: code
    })
  }
  catch(error){
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: "There was some internal server error in fetching the response"})
  }
}

export { register, login, handleResumeUpload, fetchResumeResults, handleAIAnalysis, handleAICodeGeneration };
