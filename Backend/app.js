import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import cors from "cors"
import userRoutes from "./Routes/UserRoutes.js"
dotenv.config({path: path.resolve("../.env")})
const app = express();
app.use(cors())
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