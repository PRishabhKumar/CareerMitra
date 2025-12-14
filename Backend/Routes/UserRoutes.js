import { Router } from "express";
import {register, login, handleResumeUpload, fetchResumeResults} from "../Controllers/userController.js"
import upload from "../config/multerConfig.js"
import {authenticateToken} from "../Middlewares/JWTMiddleware.js";
const router  = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/upload-resume").post(authenticateToken, upload.single("resume"), handleResumeUpload)
router.route("/resumeResults/:id").get(authenticateToken, fetchResumeResults)

export default router
