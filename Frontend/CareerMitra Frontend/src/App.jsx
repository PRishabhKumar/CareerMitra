import { useState } from 'react'
import {AuthProvider} from "./Contexts/AuthContext.jsx"
import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import Auth from './pages/Authentication/Auth.jsx'
function App() {
  return (
    <>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path='/auth' element={<Auth/>}/>
            </Routes>
          </AuthProvider>
        </Router>
    </>
  )
}

export default App
