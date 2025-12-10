import multer from "multer"
import {CloudinaryStorage} from "multer-storage-cloudinary"
import cloudinary from "./cloudinaryConfig.js"

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "uploaded_resumes",
        resource_type: "raw",
        allowed_formats: ["pdf"],
        public_id: (req, file)=>{
            return `resume_${Date.now()}`;
        }
    }
})

const upload = multer({storage})
export default upload;