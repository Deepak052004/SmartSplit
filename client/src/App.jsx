import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateSplit from "./pages/CreateSplit";
import SplitDetails from "./pages/SplitDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-split" element={<CreateSplit />} />
        <Route path="/split/:id" element={<SplitDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
