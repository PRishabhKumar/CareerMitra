import mongoose from "mongoose";

const resumeSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: "UserModel",
        require: true
    },
    fileURL: {
        type: String,
        require: true,
    },
    fileID: {
        type: String,
        require: true
    },
    uploadTime: {
        type: Date,
        default: Date.now
    }
})

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;