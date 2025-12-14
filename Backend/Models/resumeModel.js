import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
      index: true,
    },

    // Cloudinary / storage metadata
    fileURL: {
      type: String,
      required: true,
    },

    fileID: {
      type: String,
      required: true,
    },

    // PDF processing metadata
    pdfType: {
      type: String,
      enum: ["TEXT", "OCR", "MIXED"],
      default: "TEXT",
    },

    extractedText: {
      type: String,
      default: "",
    },

    extractionStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    extractionError: {
      type: String,
      default: null,
    },

    // Future AI outputs (OPTIONAL but READY)
    aiRefinedText: {
      type: String,
      default: "",
    },

    latexCode: {
      type: String,
      default: "",
    },

    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    uploadTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
