import { Routes, Route } from "react-router-dom";
import Home from "./page/home";
import Login from "./page/login";
import Register from "./page/registration";
import Dashboard from "./page/dashboard";
import Profile from "./page/profile";
import Chat from "./page/chat";



// import Posts from "./page/posts"; // if you have posts

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
       <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 

      {/* DASHBOARD LAYOUT ROUTE */}
      <Route path="/dashboard" element={<Dashboard />}>
        {/* default right-side content */}
        <Route index element={<h2>Welcome to Dashboard</h2>} />

        {/* NESTED ROUTES (INSIDE DASHBOARD) */}
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:userId" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
