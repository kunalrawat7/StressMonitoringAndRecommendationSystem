import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import UserAccess from "./pages/UserAccess";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Result from "./pages/Result";
import History from "./pages/History";
import Trends from "./pages/Trends";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/access" element={<UserAccess />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/result" element={<Result />} />
      <Route path="/history" element={<History />} />
      <Route path="/trends" element={<Trends />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;