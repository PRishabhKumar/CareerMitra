import jwt from "jsonwebtoken"

export const authenticateToken  = (req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(401).json({message: "No token was provided"})
    }
    const token = authHeader.split(" ")[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userID = decoded.userID;
        next()
    }
    catch(error){
        res.status(401).json({message: "Invalid token"})
    }
}