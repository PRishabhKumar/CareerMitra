import React, { useRef } from "react";
import "./Styles/CodePreviewStyles.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function CodePreview() {
    const location = useLocation();
    const navigator = useNavigate();    
    const previewRef = useRef(null)
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        if(location.state && location.state.latexCode){
        setCode(location.state.latexCode)
        }
        else{
            setError("No latex code was recieved...")
            setLoading(false)
        }
    }, [location.state])
    const handleClose = ()=>{
        navigator(-1);
    }
    return ( 
        <div className="latex-preview-page">
      <div className="latex-preview-container">
        <div className="latex-preview-header">
          <h2>LaTeX Preview</h2>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="latex-preview-body">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Rendering LaTeX...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>❌ {error}</p>
            </div>
          )}

          <div 
            ref={previewRef} 
            className="latex-output"
            style={{ display: loading ? 'none' : 'block' }}
          />
        </div>
      </div>
    </div>
  );
}

export default CodePreview;