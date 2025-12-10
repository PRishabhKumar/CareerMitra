import { Router } from "express";
import {register, login, handleResumeUpload} from "../Controllers/userController.js"
import upload from "../config/multerConfig.js"
import {authenticateToken} from "../Middlewares/JWTMiddleware.js";
const router  = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/upload-resume").post(authenticateToken, upload.single("resume"), handleResumeUpload)

export default router
