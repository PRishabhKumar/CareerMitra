import "./Styles/resultsStyle.css"
import { useLocation } from "react-router-dom";
import { useState, useEffect} from "react";
import axios from "axios"
function Results() {
    const location = useLocation()
    const resumeID = location.state() || {}
    const [message, setMessage] = useState("")
    const [pdfType, setPdfType] = useState("")
    const [extractedText, setExtractedText] = useState("")
    const [extractionStatus, setExtractionStatus] = useState("")
    const [extractionError, setExtractionError] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const fetchResults = async ()=>{
        if(!resumeID){
            setErrorMessage("No reusme ID was recieved...");
            return
        }
        try{
            const res = await axios.get(`http://localhost:3000/api/v1/users/resumeResults/${resumeID}`)
            const data = res.data
            setMessage(data.message)
            setPdfType(data.pdfType)
            setExtractedText(data.extractedText)
            setExtractionStatus(data.extractionStatus)
        }
        catch(error){
            console.log("This error occured in fetching the results : ", error)
            setErrorMessage("Failed to fetch results....")
        }
    }
    return ( 
        <>
            <div className="resultsContainer">
                
            </div>
        </>
    );
}

export default Results;