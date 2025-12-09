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
    }
})

const UserModel = mongoose.model("User", UserSchema);

export {UserModel};