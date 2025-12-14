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
import { createWorker } from "tesseract.js";
import path from "path";
import { UserModel } from "../Models/userModel.js";
import Resume from "../Models/resumeModel.js";
import cloudinary from "../config/cloudinaryConfig.js";

// Including the skills dictionary 

const skillsDictionaryPath = path.join(process.cwd(), "Utilities", "skills.json")
const skillsDictionary = JSON.parse(fs.readFileSync(skillsDictionaryPath, "utf8"))

console.log("Skills dictionary imported successfully....", skillsDictionary)

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

// ========================================== PDF Processing functions ==========================================

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
    console.log("PDF type detection failed:", error.message);
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
  const textBased = await isTextPDF(pdfBuffer);
  return textBased
    ? extractTextFromPDF(pdfBuffer)
    : extractTextFromOCR(pdfBuffer);
}

// ========================================== ATS Score calculation function =======================================

// Step 1 --> Normalize the text

function normalizeText(text){
  // convert the text to lower case, replace every character other than alphabets and numbers and whitespaces to whitespace and also convert all multiple whitespaces and tabs etc to single whitespaces
  return text.toLowerCase().replace(/[^a-z0-9\s+]/g, " ").replace(/\s+/g, " ").trim() 
}

// Step 2 --> Extract skills from resume

function extractSkills(resumeText, skillsDictionary){
  const foundSkills = []
  for(const category in skillsDictionary){
    foundSkills[category] = []
    for(const skill of skillsDictionary[category]){
      const normalizedSkill = skill.toLowerCase(skill);
      if(resumeText.includes(normalizedSkill)){
        foundSkills[category].push(skill);
      }
    }      
  }
  return foundSkills;
}

// Step 3 --> Resume structure analysis

function analyzeResumeStructure(text){
  const sections = {
    experience: /experience|work experience/.test(text),
    education: /education/.test(text),
    skils: /skills/.test(text),
    projects: /projects/.test(text)
  };
  const sectionScore = Object.values(sections).filter(Boolean).length/Object.keys(sections).length
  return sectionScore;
}

// Step 4 --> Action Verb Analysis

function analyzeActionVerbs(text){
  let count = 0
  let ACTION_VERBS = ["developed", "built", "designed", "implemented", "led", "optimized", "created", "managed"];
  for(const verb of ACTION_VERBS){
    if(text.includes(verb)){
      count++;
    }
  }
  return Math.min(count/10, 1); // this caps the value at 1
}

// Step 5 --> keyword density score

function calculateKeyWordDensityScore(text){
  const words = text.split(" ");
  const uniqueWords = new Set(words); // this automatically removes all duplicate words
  return Math.min(uniqueWords.size/words.length, 1);
}

// Step 6 --> Calulate ATS Score without JD

function ATSWithoutJD(text){
  const normalizedText = normalizeText(normalizeText);
  const skills = extractSkills(normalizedText)
  const structureScore = analyzeResumeStructure(normalizeText) 
  const actionVerbScore = analyzeActionVerbs(normalizedText)
  const keywordScore = calculateKeyWordDensityScore(normalizeText)

  const skillScore = Math.min(skills.length/10, 1)
  const ATS_Score = skillScore*0.4 + structureScore*0.25 + actionVerbScore*0.2 + keywordScore*0.15
  return {
    ATS_Score: ATS_Score,
    breakdown: {
      skillScore,
      structureScore,
      actionVerbScore,
      keywordScore
    }
  }
}

// Step 7 --> ATS with JD

// (I) Extracting keywords from JD

function extractJDKeyword(jd){
  return Array.from(
    new Set(
      normalizeText(jd).split(jd).filter((w)=>{
        w.length>3
      })
    )
  )
}

// (II) Match resume with JD

function matchJDAndResume(resumeText, jdKeywords){
  let matchCount = 0
  for(const keyword of jdKeywords){
    if(resumeText.includes(keyword)){
      count++;
    }
  }
  return matchCount/jdKeywords.length;
}

// (III) Calclate ATS Score

function ATSWithJD(extractedText, jd){
  const normalizedText = normalizeText(extractedText)
  const jdKeywords = extractJDKeyword(jd)

  const JDMatchScore = matchJDAndResume(normalizedText, jd)
  const structureScore = analyzeResumeStructure(normalizedText)
  const actionVerbScore = analyzeActionVerbs(normalizedText)

  const ATS_Score = JDMatchScore*0.5 + structureScore*0.25 + actionVerbScore*0.25;

  return {
    ATS_Score: ATS_Score,
    breakdown: {
      JDMatchScore,
      structureScore,
      actionVerbScore
    }
  }
}

// Master function for calculating ATS Score

function calcualteATS_Score({extractedText, jd = null}){
  if(jd){
    return ATSWithJD(extractedText, jd)
  }
  else{
    return ATSWithoutJD(extractedText)
  }
}

// ========================================== Master function to handle PDF uploads ================================

const handleResumeUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdfBuffer = req.file.buffer;

    // First extract the text from PDF
    const extractedText = await processPDF(pdfBuffer);

    // calculating the ATS Score 

    const ATS_Score = calcualteATS_Score({
      extractedText,
      jd: req.body.js || null
    })

    // manual upload to cloudinary after processing
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

    // finally save the obtained URL in the DB
    const savedResume = await Resume.create({
      userID: req.userID,
      fileURL: uploadResult.secure_url,
      fileID: uploadResult.public_id,
      extractedText,
      extractionStatus: "SUCCESS",
      atsScore: ATS_Score,
      uploadTime: new Date(),
    });

    res.status(201).json({
      message: "Resume uploaded & processed successfully",
      resumeID: savedResume._id,
      extractedText,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Resume upload failed" });
  }
};

const fetchResumeResults = async (req, res) => {
  const { id } = req.params;
  try {
    let doc = await Resume.findById(id);
    if (!doc) {
      return res
        .status(404)
        .json({ message: "No document was found with this id" });
    }
    if (doc.userID.toString() !== req.userID) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "You are not allowed to access this document" });
    }
    return res.status(httpStatus.OK).json({
      message: "Document fetched successfully !!!",
      pdfType: doc.pdfType,
      extractedText:
        doc.extractedText || "No extracted text was found for this document",
      extractionStatus: doc.extractionStatus,
      extractionError: doc.extractionError || null,
    });
  } catch (error) {
    console.log("This error occured in doc retrieval : ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message:
        "There was some internal server error in retriveing your document. Please try again later.",
    });
  }
};

export { register, login, handleResumeUpload, fetchResumeResults };
