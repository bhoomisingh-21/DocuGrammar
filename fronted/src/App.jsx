import React from "react";
import { Routes, Route } from "react-router-dom";
import DocuGrammarDemo, { CTASection, TestimonialsSection } from "./DocuGrammarDemo";
import Navbar from "./NavBar";
import Features from "./Features";
import Page from "./Page";
import UploadFile from "./UploadFile"; // your new home page
import FooterSection from "./FooterSection"; // NO curly braces
import ResultPage from "./Result";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Profile from "./Profile";

export default function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route
        path="/"
        element={
          <div className="w-full min-h-screen bg-[#0b0f19]">
            <Navbar />
            <Page />
            <CTASection />
            <FooterSection />
          </div>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<Profile />} />

      {/* Dashboard / Home Page */}
      <Route
        path="/upload"
        element={<UploadFile />}
      />
      <Route
        path="/result"
        element={<ResultPage />}
      />
    </Routes>
  );
}
