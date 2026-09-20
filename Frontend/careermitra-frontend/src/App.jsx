import React from "react";
import { useState } from "react";
import { AuthProvider } from "./Contexts/AuthContext.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Auth from "./pages/Authentication/Auth.jsx";
import Home from "./pages/Home/Home.jsx";
import Navbar from "./pages/Home/Navbar.jsx";
import LandingPage from "./pages/Landing Page/LandingPage.jsx";
import Results from "./pages/Results/Results.jsx";
import Analysis from "./pages/AnalysisPage/Analysis.jsx";
import CodePage from "./pages/CodePage/CodePage.jsx";
import CodePreview from "./pages/Code Preview/CodePreview.jsx";
import ProtectRoute from "./utils/ProtectRoute.jsx";
import NotFound from "./pages/Not Found Page/NotFound.jsx";
import FeaturesPage from "./pages/Features/FeaturesPage.jsx";
import BuildResume from "./pages/BuildResume/BuildResume.jsx";
import TemplateSelection from "./pages/TemplateSelection/TemplateSelection.jsx";
import ForgotPassword from "./pages/Authentication/ForgotPassword.jsx";
import ResetPassword from "./pages/Authentication/ResetPassword.jsx";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/home"
              element={
                <ProtectRoute>
                  <Home />
                </ProtectRoute>
              }
            />
            <Route
              path="/results/:id"
              element={
                <ProtectRoute>
                  <Results />
                </ProtectRoute>
              }
            />
            <Route
              path="/analysis"
              element={
                <ProtectRoute>
                  <Analysis />
                </ProtectRoute>
              }
            />
            <Route
              path="/code"
              element={
                <ProtectRoute>
                  <CodePage />
                </ProtectRoute>
              }
            />
            <Route
              path="/build-resume"
              element={
                <ProtectRoute>
                  <BuildResume />
                </ProtectRoute>
              }
            />
            <Route
              path="/select-template"
              element={
                <ProtectRoute>
                  <TemplateSelection />
                </ProtectRoute>
              }
            />
            <Route
              path="/preview"
              element={
                <ProtectRoute>
                  <CodePreview />
                </ProtectRoute>
              }
            />
            <Route
              path="/features"
              element={
                <FeaturesPage />
              }
            />
            <Route
              path="/forgot-password"
              element={
                <ForgotPassword />
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <ResetPassword />
              }
            />
            <Route
              path="*"
              element={
                <ProtectRoute>
                  <NotFound />
                </ProtectRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
