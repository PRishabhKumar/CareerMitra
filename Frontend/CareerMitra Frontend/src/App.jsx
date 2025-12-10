import { useState } from 'react'
import {AuthProvider} from "./Contexts/AuthContext.jsx"
import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import Auth from './pages/Authentication/Auth.jsx'
import Home from './pages/Home/Home.jsx'
function App() {
  return (
    <>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path='/auth' element={<Auth/>}/>
              <Route path='/home' element={<Home/>}/>              
            </Routes>
          </AuthProvider>
        </Router>
    </>
  )
}

export default App
