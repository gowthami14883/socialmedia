import { Routes, Route } from "react-router-dom";
import Home from "./page/home";
import Login from "./page/login";
import Register from "./page/registration";
import Dashboard from "./page/dashboard";
import Profile from "./page/profile";
import Chat from "./page/chat";



function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} /> {/* Private Dashboard */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/chat" element={<Chat />} />

    </Routes>
  );
}

export default AppRoutes;
