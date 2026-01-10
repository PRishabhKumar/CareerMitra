import React from 'react'
import { useState } from 'react'
import {AuthProvider} from "./Contexts/AuthContext.jsx"
import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import Auth from './pages/Authentication/Auth.jsx'
import Home from './pages/Home/Home.jsx'
import Navbar from './pages/Home/Navbar.jsx'
import LandingPage from './pages/Landing Page/LandingPage.jsx'
import Results from './pages/Results/Results.jsx'
import Analysis from './pages/AnalysisPage/Analysis.jsx'
import CodePage from './pages/CodePage/CodePage.jsx'
import CodePreview from './pages/Code Preview/CodePreview.jsx'
function App() {
  return (
    <>
        
        <Router>
          <AuthProvider>
            <Navbar/>
            <Routes>
              <Route path='/' element={<LandingPage/>}/>
              <Route path='/auth' element={<Auth/>}/>
              <Route path='/home' element={<Home/>}/>    
              <Route path='/results/:id' element={<Results/>}/>  
              <Route path='/analysis' element={<Analysis/>}/> 
              <Route path='/code' element={<CodePage/>}/>   
              <Route path='/preview' element={<CodePreview/>}/>    
            </Routes>
          </AuthProvider>
        </Router>
    </>
  )
}

export default App
