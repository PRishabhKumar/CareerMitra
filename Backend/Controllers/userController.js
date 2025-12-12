import crypto from "crypto";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../Models/userModel.js";
import Resume from "../Models/resumeModel.js";
// function to register user

const register = async (req, res) => {
  let { username, password, phoneNumber, emailID } = req.body;
  try {
    let existingUser = await UserModel.findOne({ username: username });
    if (existingUser) {
      console.log(
        "A user already exists with this username. Please try a different username"
      );
      res
        .status(httpStatus.CONFLICT)
        .json({ message: "A user with this username already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      let newUser = new UserModel({
        username,
        password: hashedPassword,
        phoneNumber,
        emailID,
      });
      await newUser.save();
      const token = jwt.sign({ userID: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(httpStatus.CREATED).json({
        message: "User successfully registered...",
        token,
        username: newUser.username,
      });
      console.log("User registered successfully !!!");
    }
  } catch (error) {
    console.log(
      "This error occured in creating the user or fetching the user details : ",
      error
    );
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ messgae: "User registration failed due to server error" });
  }
};

const login = async (req, res) => {
  let { username, password } = req.body;
  try {
    let user = await UserModel.findOne({ username: username });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).json({
          message: "User authenticated successfully...",
          token,
          username: user.username,
        });
        console.log("Authentication successfull....");
      } else {
        res
          .status(401)
          .json({ message: "Credentials dont match, plesae try again.." });
        console.log("No match");
      }
    } else {
      console.log("User not found..");
      res.status(404).json({
        message: "User not found... Please register before attempting login",
      });
    }
  } catch (error) {
    console.log("This error occured in authenticating the user : ", error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Some internal error crashed authentication..." });
  }
};

const handleResumeUpload = async (req, res) => {
  try {
    console.log("=== UPLOAD START ===");
    console.log("User ID:", req.userID);
    console.log("File object:", req.file);
    console.log("ENV - Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("ENV - API Key exists:", !!process.env.CLOUDINARY_API_KEY);

    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded" });
    }

    const fileUpload = await Resume.create({
      userID: req.userID,
      fileURL: req.file.path,
      fileID: req.file.filename,
      uploadTime: new Date(),
    });

    console.log("=== UPLOAD SUCCESS ===");
    console.log("Saved to DB:", fileUpload);

    res.status(201).json({
      message: "Resume uploaded successfully...",
      url: req.file.path,
      data: req.file.filename,
    });
  } catch (error) {
    console.log("=== UPLOAD ERROR ===");
    console.log("Error:", error.message);
    console.log("Stack:", error.stack);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "There was some internal server error in uploading the resume",
    });
  }
};

export { register, login, handleResumeUpload };
