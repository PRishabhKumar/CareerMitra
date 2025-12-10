import axios from "axios"
import httpStatus from "http-status"
import { Children, createContext, useState } from "react";
import {useNavigate} from "react-router-dom"
import server from "../environment.js"

export const AuthContext = createContext({});
const client = axios.create(({
    baseURL: `${server}/api/v1/users`
}))

export const AuthProvider = ({children}) =>{
    const [userData, setUserData] = useState(null);
    const router = useNavigate();
    const handleRegister = async (username, password, phoneNumber, emailID) => {
        try{
            const request = await client.post("/register", {
                username,
                password,
                phoneNumber,
                emailID
            })
            if(request.status === httpStatus.CREATED){
                return request.data.message || "User registered successfully"
            }            
        }
        catch(error){
            console.log("This error occured in registering the user : ", error)
            throw error;
        }
    }
    // handle login
    const handleLogin = async (username, password)=>{
        try{
            let request = await client.post("/login", {
                username,
                password
            })
            if(request.status === httpStatus.OK){
                localStorage.setItem("token", request.data.token) // add the token and username to the local storage
                localStorage.setItem("userame", request.data.username) 
            }
            return request.data.message || "User authenticated usccessfully"
        }
        catch(error){
            console.log('This error occured in authenticating the user : ', error);
            throw error;
        }
    }
    // handle  logout
    const handleLogout = async ()=>{
        setUserData(null); // remove  all the stored user data from React state and also from localStorage
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        console.log("User logged out")
        router("/"); // redirect back to the home page
    }
    const data = {
        userData,
        setUserData,
        handleRegister,
        handleLogin,
        handleLogout
    }
    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>
}


export default AuthContext;