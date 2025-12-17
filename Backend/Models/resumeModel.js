import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
      index: true,
    },

    fileURL: {
      type: String,
      required: true,
    },

    fileID: {
      type: String,
      required: true,
    },

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

    aiReport: {
      type: String,
      default: ""
    },

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
      max: 1,
      required: true,
    },

    atsBreakdown: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    uploadTime: {
      type: Date,
      default: Date.now,
    },

    jd: {
      type: String,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
