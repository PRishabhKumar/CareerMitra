import React, { useState, useEffect } from "react";
import "./Styles/CodePageStyle.css"
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function CodePage() {
    const [code, setCode] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const getCode = async()=>{
        try{
            const res = await axios.post("http://localhost:5000/code")
            const code = res.code
            setCode(code)
            setMessage(res.message || "Refined doc fetched successfully...")
        }
        catch(error){
            if(error && error.response && error.response.data, error.response.data.message){
                setError(error.response.data.message)
            }
            else{
                setError("There some some error in fetching the refined document....")
            }
        }
    }
    useEffect(async ()=>{
        await getCode()
    }, [])
    return ( 
        <>
            <div className="codePageContainer">
                <div className="codeContainer">
                    {code}
                </div>
            </div>
        </>
    );
}

export default CodePage;