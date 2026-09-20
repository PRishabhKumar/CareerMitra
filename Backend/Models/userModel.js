import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        require: true,
        type: String
    },
    password: {
        require: true,
        type: String
    },
    phoneNumber: {
        require: true,
        type: String
    },
    emailID: {
        require: true,
        type: String
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
})

const UserModel = mongoose.model("User", UserSchema);

export {UserModel};