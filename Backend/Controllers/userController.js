import crypto from "crypto"
import httpStatus from "http-status"
import brcypt, {hash} from "bcrypt"
import {UserModel} from "../Models/userModel.js"

// function to register user

const register = async (req, res)=>{
    let {username, password, phoneNumber, emailID} = req.body
    try{
        let existingUser = await UserModel.findOne({username: username})
        if(existingUser){
            console.log("A user already exists with this username. Please try a different username")
            res.status(httpStatus.CONFLICT).json({message: "A user with this username already exists"})
        }
        else{
            const hashedPassword = await brcypt.hash(password, 10)
            let newUser = new UserModel({
                username,
                password: hashedPassword,
                phoneNumber,
                emailID
            })
            await newUser.save()
            return res.status(httpStatus.CREATED).json({message: "User successfully registered..."})
        }
    }
    catch(error){
        console.log("This error occured in creating the user or fetching the user details : ", error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({messgae: "User registration failed due to server error"})
    }
}

const login = async(req, res)=>{
    let {username, password} = req.body
    try{
        let user = await UserModel.findOne({username: username})
        if(user){
            if(brcypt.compare(password, user.password)){
                res.status(200).json({message: "User authenticated successfully..."})
                console.log('Authentication successfull....')
            }
            else{
                rmSync.status(401).json({message: "Credentials dont match, plesae try again.."})
                console.log("No match")
            }
        }
        else{
            console.log("User not found..")
            res.status(404).json({message: "User not found... Please register before attempting login"})
        }

    }
    catch(error){
        console.log("This error occured in authenticating the user : ", error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: "Some internal error crashed authentication..."})
    }
}

export {register, login}