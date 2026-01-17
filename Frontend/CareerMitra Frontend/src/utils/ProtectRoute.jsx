import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'
import "./ProtectRouteStyle.css"
function ProtectRoute({children}) {
    const navigator = useNavigate();
    const [showWarning, setShowWarning] = useState(false);
    // check if token exists or not
    const token = localStorage.getItem("token")
    useEffect(()=>{
        if(!token){
            setShowWarning(true)
            // give the user some time to read the message
            const timer = setTimeout(()=>{
                // remove the warning message
                setShowWarning(false);
                // redirect to auth route
                navigator("/auth")
            }, 1500) 
            return ()=>{
                clearTimeout(timer)
            }         
        }
    }, [token, navigator])
    if(showWarning){
        return(
            <div className="warningContainer">
                <h3>Access denied</h3>
                <p>You must be logged in to perform this operation</p>
            </div>
        )
    }
    if(token){
        return children // if token exists, the component in rendered
    }
    return null; // just to avoid code breakng in some rare cases (mostly this line will never be reached)
}

export default ProtectRoute;