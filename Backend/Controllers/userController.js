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

const handleResumeUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdfBuffer = req.file.buffer;

    // 1. Process PDF (Extract Text)
    const extractedText = await processPDF(pdfBuffer);

    // 2. Upload to Cloudinary manually
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

    // 3. Save to DB
    const savedResume = await Resume.create({
      userID: req.userID,
      fileURL: uploadResult.secure_url,
      fileID: uploadResult.public_id,
      extractedText,
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
