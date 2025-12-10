import { useState } from "react";
import "./Styles/HomeStyle.css"
import axios from "axios"
function Home() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const handleFileUpload = async(e)=>{
        try{
            setFile(e.target.files[0])
            setMessage('File Uploaded successfully....')
        }   
        catch(error){
            console.log('This error occured in uploading the file : ', error)
            setError("Something went wrong while uploading the file. Please try again later....")
        }     
    }
    const handleSubmit = async(e)=>{
        e.preventDefault()
        const formData = new FormData();
        formData.append("resume", file)
        const token = localStorage.getItem("token")
        try{
            const res = await axios.post("http://localhost:3000/api/v1/users/upload-resume",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log(res.data)
            setMessage('File uploaded successfully...')
        }
        catch(error){
            console.log(`This error occured in uplaoding the file : ${error}`)
        }
        console.log(file)
    }
    return ( 
        <>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <input type="file" accept="pdf" onChange={handleFileUpload} />
                    <button type="submit">Upload</button>
                </form>
            </div>
            {
                message && (
                    <div className="successMessageContainer">
                        {message}
                    </div>
                )
            }
            {
                error && (
                    <div className="errorContainer">
                        <h3>{`This error occured : ${error}`}</h3>
                    </div>
                )
            }
        </>
    );
}

export default Home;