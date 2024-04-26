// import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";
import "./tailwind.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
