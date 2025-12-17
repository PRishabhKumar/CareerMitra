import { Router } from "express";
import {register, login, handleResumeUpload, fetchResumeResults, handleAIAnalysis, handleAICodeGeneration} from "../Controllers/userController.js"
import upload from "../config/multerConfig.js"
import {authenticateToken} from "../Middlewares/JWTMiddleware.js";
const router  = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/upload-resume").post(authenticateToken, upload.single("resume"), handleResumeUpload)
router.route("/resumeResults/:id").get(authenticateToken, fetchResumeResults)
router.route("/analyze").post(handleAIAnalysis)
router.route("/code").post(handleAICodeGeneration)

export default router
