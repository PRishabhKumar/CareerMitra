import dotenv from "dotenv"
import path from "path"
dotenv.config() 
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import userRoutes from "./Routes/UserRoutes.js"
const app = express();
const allowedOrigins = [
    "http://52.66.182.154:5173",            // Local/Old dev IP
    "https://d2hzohjrs1tfem.cloudfront.net", // CloudFront (needs https://)
    "https://careermitra.dev",               // Main Domain
    "https://www.careermitra.dev"            // WWW Domain
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set("port", process.env.PORT || 3000);

app.use("/api/v1/users", userRoutes)

const startServer = async ()=>{
    try{
        // connect with the DB cluster
        const connection = await mongoose.connect(process.env.DB_CONNECTION_STRING)
        console.log("Connected successfully with the database cluster");
        // making the server to listen for requests
        app.listen(app.get("port"), ()=>{
            console.log("Server is now active and is listening for requests on port " + app.get("port"))
        })
    }
    catch(error){
        console.log("Either DB connection failed or srever couldnt start because of this error : ", error)
    }
}

app.get("/", (req, res)=>{
    res.send("This is the home/index route")
})

startServer()